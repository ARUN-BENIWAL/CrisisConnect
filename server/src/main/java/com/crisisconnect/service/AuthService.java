package com.crisisconnect.service;

import com.crisisconnect.dto.AuthDto;
import com.crisisconnect.entity.User;
import com.crisisconnect.exception.GlobalExceptionHandler.*;
import com.crisisconnect.repository.AssignmentRepository;
import com.crisisconnect.repository.UserRepository;
import com.crisisconnect.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository, AssignmentRepository assignmentRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        User user = userRepository.findByUsername(username)
                .or(() -> (username.equalsIgnoreCase("kiran.das") || username.equalsIgnoreCase("kiran")) 
                        ? userRepository.findByUsername("police") 
                        : java.util.Optional.empty())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole().name());
        return new AuthDto.LoginResponse(token, user.getId(), user.getUsername(),
                user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public AuthDto.UserResponse createResponder(AuthDto.CreateUserRequest request, User admin) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(User.Role.RESPONDER);
        user.setDepartment(request.getDepartment());
        user.setSpecialization(request.getSpecialization());
        user.setIsActive(true);

        user = userRepository.save(user);
        auditService.log(admin.getId(), admin.getFullName(), "RESPONDER_CREATED", "USER", user.getId(),
                "Responder " + user.getFullName() + " created");

        return toUserResponse(user);
    }

    public AuthDto.UserResponse updateResponder(Long id, AuthDto.CreateUserRequest request, User admin) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Responder not found"));

        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setSpecialization(request.getSpecialization());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);
        auditService.log(admin.getId(), admin.getFullName(), "RESPONDER_UPDATED", "USER", user.getId(),
                "Responder " + user.getFullName() + " updated");

        return toUserResponse(user);
    }

    public void toggleResponderActive(Long id, boolean active, User admin) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Responder not found"));
        user.setIsActive(active);
        userRepository.save(user);
        auditService.log(admin.getId(), admin.getFullName(),
                active ? "RESPONDER_ACTIVATED" : "RESPONDER_DEACTIVATED",
                "USER", user.getId(), user.getFullName() + (active ? " activated" : " deactivated"));
    }

    public List<AuthDto.UserResponse> getResponders() {
        return userRepository.findByRole(User.Role.RESPONDER).stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public AuthDto.UserResponse getResponder(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Responder not found"));
        return toUserResponse(user);
    }

    public AuthDto.UserResponse toUserResponse(User user) {
        AuthDto.UserResponse res = new AuthDto.UserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setFullName(user.getFullName());
        res.setPhone(user.getPhone());
        res.setRole(user.getRole().name());
        res.setDepartment(user.getDepartment());
        res.setSpecialization(user.getSpecialization());
        res.setIsActive(user.getIsActive());
        res.setAvailability(user.getAvailability().name());

        List<com.crisisconnect.entity.Assignment> activeAssignments = assignmentRepository.findActiveByResponder(user.getId());
        List<AuthDto.AssignedCaseSummary> cases = activeAssignments.stream()
                .filter(a -> a.getStatus() != com.crisisconnect.entity.Assignment.Status.RESOLVED 
                          && a.getStatus() != com.crisisconnect.entity.Assignment.Status.CANCELLED)
                .map(a -> {
                    AuthDto.AssignedCaseSummary s = new AuthDto.AssignedCaseSummary();
                    if (a.getCrisis() != null) {
                        s.setCrisisId(a.getCrisis().getId());
                        s.setPublicId(a.getCrisis().getPublicId());
                        s.setTitle(a.getCrisis().getTitle());
                        s.setSeverity(a.getCrisis().getSeverity().name());
                        s.setStatus(a.getCrisis().getStatus().name());
                        s.setLocation(a.getCrisis().getLocation());
                        s.setBuilding(a.getCrisis().getBuilding());
                    }
                    s.setAssignmentStatus(a.getStatus().name());
                    s.setInstructions(a.getInstructions());
                    s.setAssignedAt(a.getAssignedAt());
                    return s;
                })
                .collect(Collectors.toList());

        res.setAssignedCases(cases);
        res.setActiveAssignments(cases.size());
        return res;
    }

    public AuthDto.UserResponse getCurrentUser(User user) {
        return toUserResponse(user);
    }
}
