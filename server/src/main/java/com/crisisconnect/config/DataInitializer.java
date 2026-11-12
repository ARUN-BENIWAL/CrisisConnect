package com.crisisconnect.config;

import com.crisisconnect.entity.Crisis;
import com.crisisconnect.entity.CrisisCategory;
import com.crisisconnect.entity.User;
import com.crisisconnect.repository.CrisisCategoryRepository;
import com.crisisconnect.repository.CrisisRepository;
import com.crisisconnect.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final UserRepository userRepository;
    private final CrisisCategoryRepository categoryRepository;
    private final CrisisRepository crisisRepository;
    private final com.crisisconnect.repository.AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, 
                           CrisisCategoryRepository categoryRepository,
                           CrisisRepository crisisRepository,
                           com.crisisconnect.repository.AssignmentRepository assignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.crisisRepository = crisisRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedCategories();
        seedUsers();
        seedSampleCrises();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            String[][] categories = {
                {"Medical Emergency", "Severe illness, sudden injury, heart attack, or loss of consciousness", "stethoscope"},
                {"Fire / Hazardous Material", "Active smoke, fire outbreak, chemical spill, or gas leak", "flame"},
                {"Physical Threat & Violence", "Active intruder, assault, robbery, or armed threat on campus", "shield-alert"},
                {"Mental Health Crisis", "Severe emotional distress, psychological crisis, or suicidal ideation", "heart-handshake"},
                {"Facility / Infrastructure", "Elevator entrapment, power outage, water main leak, structural failure", "building"},
                {"General Campus Safety", "Weather emergency, suspicious activity, disturbance, or other safety concern", "alert-triangle"},
            };

            for (String[] cat : categories) {
                CrisisCategory c = new CrisisCategory();
                c.setName(cat[0]);
                c.setDescription(cat[1]);
                c.setIcon(cat[2]);
                c.setIsActive(true);
                categoryRepository.save(c);
            }
            log.info("Initialized 6 default crisis response categories.");
        }
    }

    private void seedUsers() {
        // Create default admin for SRM KTR
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("cso.security@srmist.edu.in");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("Col. R. Sundararajan (Chief Security Officer)");
            admin.setPhone("044-2745 2270");
            admin.setRole(User.Role.ADMIN);
            admin.setDepartment("SRM KTR Security Control");
            admin.setIsActive(true);
            admin.setAvailability(User.Availability.AVAILABLE);
            userRepository.save(admin);
            log.info("Admin created — username: admin, password: admin123");
        }

        // Create quick demo responders matching SRM KTR UI preset buttons
        createResponderIfMissing("medic", "medic123", "casualty.hospital@srmist.edu.in", "[SRM Hospital EMT] Dr. S. Karthik", "044-4743 2345", "SRM Hospital Emergency", "Trauma Care & Critical Resuscitation");
        createResponderIfMissing("police", "police123", "security.patrol@srmist.edu.in", "[Campus Patrol] Kiran Das", "+91 94440 22701", "SRM Campus Vigilance", "Motorized Perimeter Patrol & Anti-Ragging");
        createResponderIfMissing("counselor", "counselor123", "counselor.wellness@srmist.edu.in", "[SRM Counselor] Dr. Ananya Iyer", "044-2741 7800", "SRM Student Counseling (Tele-MANAS)", "Psychological Crisis & Stress De-escalation");
    }

    private void createResponderIfMissing(String username, String password, String email, String fullName, String phone, String department, String spec) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User r = new User();
            r.setUsername(username);
            r.setPasswordHash(passwordEncoder.encode(password));
            r.setEmail(email);
            r.setFullName(fullName);
            r.setPhone(phone);
            r.setRole(User.Role.RESPONDER);
            r.setDepartment(department);
            r.setSpecialization(spec);
            r.setIsActive(true);
            r.setAvailability(User.Availability.AVAILABLE);
            userRepository.save(r);
        }
    }

    private void seedSampleCrises() {
        if (crisisRepository.count() == 0) {
            List<CrisisCategory> cats = categoryRepository.findAll();
            if (cats.isEmpty()) return;

            CrisisCategory medCat = cats.get(0);
            CrisisCategory fireCat = cats.size() > 1 ? cats.get(1) : medCat;
            CrisisCategory threatCat = cats.size() > 2 ? cats.get(2) : medCat;
            CrisisCategory facCat = cats.size() > 4 ? cats.get(4) : medCat;

            // Crisis 1: Critical Medical at Java Green / UB
            Crisis c1 = new Crisis();
            c1.setPublicId("CRISIS-100001");
            c1.setTrackingTokenHash(passwordEncoder.encode("demo-token-1"));
            c1.setTitle("Student collapsed with severe anaphylactic shock at Java Green");
            c1.setDescription("Student in University Building Java Green food court experienced sudden allergic reaction with acute respiratory distress; urgent SRM Hospital EMT required.");
            c1.setCategory(medCat);
            c1.setSeverity(Crisis.Severity.CRITICAL);
            c1.setStatus(Crisis.Status.ASSIGNED);
            c1.setPriority(1);
            c1.setLocation("University Building (UB)");
            c1.setBuilding("University Building");
            c1.setFloor("Ground Floor");
            c1.setRoom("Java Green Food Court");
            c1.setLocationDetails("Near main central atrium elevator portico");
            c1.setReporterName("Prof. K. Venkatesh");
            c1.setReporterEmail("venkatesh.k@srmist.edu.in");
            c1.setReporterPhone("+91 98401 23456");
            crisisRepository.save(c1);

            // Crisis 2: High Fire Hazard at Tech Park
            Crisis c2 = new Crisis();
            c2.setPublicId("CRISIS-100002");
            c2.setTrackingTokenHash(passwordEncoder.encode("demo-token-2"));
            c2.setTitle("Heavy smoke and electrical sparking from breaker panel in Tech Park");
            c2.setDescription("Thick burning electrical odor and grey smoke emitting from high-load circuit breaker in AI research wing corridor.");
            c2.setCategory(fireCat);
            c2.setSeverity(Crisis.Severity.HIGH);
            c2.setStatus(Crisis.Status.UNDER_REVIEW);
            c2.setPriority(2);
            c2.setLocation("Tech Park (TP)");
            c2.setBuilding("Tech Park Building");
            c2.setFloor("7th Floor");
            c2.setRoom("AI Research Lab 704");
            c2.setLocationDetails("West corridor near Lift Lobby B emergency stairs");
            c2.setReporterName("Dinesh Kumar");
            c2.setReporterEmail("dineshk@srmist.edu.in");
            c2.setReporterPhone("+91 97910 87654");
            crisisRepository.save(c2);

            // Crisis 3: Medium Facility Breakdown at Bioengineering Block
            Crisis c3 = new Crisis();
            c3.setPublicId("CRISIS-100003");
            c3.setTrackingTokenHash(passwordEncoder.encode("demo-token-3"));
            c3.setTitle("Elevator B stalled between 4th and 5th floors with 3 students");
            c3.setDescription("Elevator B stalled abruptly with three students onboard. Emergency intercom active, passengers calm but ventilation offline.");
            c3.setCategory(facCat);
            c3.setSeverity(Crisis.Severity.MEDIUM);
            c3.setStatus(Crisis.Status.IN_PROGRESS);
            c3.setPriority(3);
            c3.setLocation("School of Bioengineering");
            c3.setBuilding("Bioengineering Block");
            c3.setFloor("4th Floor");
            c3.setRoom("Elevator Shaft B");
            c3.setReporterName("Aditya Nair");
            c3.setReporterEmail("an1234@srmist.edu.in");
            c3.setReporterPhone("+91 94451 98765");
            crisisRepository.save(c3);

            // Crisis 4: Resolved Security issue at Paari Hostel
            Crisis c4 = new Crisis();
            c4.setPublicId("CRISIS-100004");
            c4.setTrackingTokenHash(passwordEncoder.encode("demo-token-4"));
            c4.setTitle("Aggressive unauthorized trespasser intercepted at Paari Hostel gate");
            c4.setDescription("Individual refusing to present campus biometric pass and arguing with hostel security personnel.");
            c4.setCategory(threatCat);
            c4.setSeverity(Crisis.Severity.HIGH);
            c4.setStatus(Crisis.Status.RESOLVED);
            c4.setPriority(2);
            c4.setLocation("Hostel Enclosure Zone");
            c4.setBuilding("Paari Hostel Block C");
            c4.setFloor("Ground Floor");
            c4.setRoom("Hostel Warden Security Desk");
            c4.setReporterName("R. Murugan");
            c4.setReporterEmail("security.hostel@srmist.edu.in");
            c4.setReporterPhone("+91 94440 22703");
            crisisRepository.save(c4);

            // Seed assignments for active crises
            userRepository.findByUsername("medic").ifPresent(medicUser -> {
                com.crisisconnect.entity.Assignment a1 = new com.crisisconnect.entity.Assignment();
                a1.setCrisis(c1);
                a1.setResponder(medicUser);
                a1.setStatus(com.crisisconnect.entity.Assignment.Status.ACCEPTED);
                a1.setInstructions("Urgent ambulance dispatch to Java Green Food Court; student in anaphylactic shock.");
                a1.setPriority(1);
                assignmentRepository.save(a1);
                medicUser.setAvailability(com.crisisconnect.entity.User.Availability.BUSY);
                userRepository.save(medicUser);
            });

            userRepository.findByUsername("police").ifPresent(policeUser -> {
                com.crisisconnect.entity.Assignment a3 = new com.crisisconnect.entity.Assignment();
                a3.setCrisis(c3);
                a3.setResponder(policeUser);
                a3.setStatus(com.crisisconnect.entity.Assignment.Status.IN_PROGRESS);
                a3.setInstructions("Assist facilities engineering with elevator intercom communication and crowd control.");
                a3.setPriority(2);
                assignmentRepository.save(a3);
                policeUser.setAvailability(com.crisisconnect.entity.User.Availability.BUSY);
                userRepository.save(policeUser);
            });

            log.info("Initialized 4 SRM KTR sample crises and active responder assignments.");
        }
    }
}
