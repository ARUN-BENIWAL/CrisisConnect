package com.crisisconnect.dto;

import java.util.List;
import java.util.Map;

public class DashboardDto {

    public static class AdminDashboard {
        private long totalCrises;
        private long unreviewedReports;
        private long unassignedCrises;
        private long assignedCrises;
        private long activeCrises;
        private long criticalCrises;
        private long resolvedCrises;
        private long closedCrises;
        private double avgResponseTimeMinutes;
        private double avgResolutionTimeMinutes;
        private List<Map<String, Object>> byCategory;
        private List<Map<String, Object>> bySeverity;
        private List<Map<String, Object>> byStatus;
        private List<Map<String, Object>> dailyTrend;

        // Getters and Setters
        public long getTotalCrises() { return totalCrises; }
        public void setTotalCrises(long v) { this.totalCrises = v; }
        public long getUnreviewedReports() { return unreviewedReports; }
        public void setUnreviewedReports(long v) { this.unreviewedReports = v; }
        public long getUnassignedCrises() { return unassignedCrises; }
        public void setUnassignedCrises(long v) { this.unassignedCrises = v; }
        public long getAssignedCrises() { return assignedCrises; }
        public void setAssignedCrises(long v) { this.assignedCrises = v; }
        public long getActiveCrises() { return activeCrises; }
        public void setActiveCrises(long v) { this.activeCrises = v; }
        public long getCriticalCrises() { return criticalCrises; }
        public void setCriticalCrises(long v) { this.criticalCrises = v; }
        public long getResolvedCrises() { return resolvedCrises; }
        public void setResolvedCrises(long v) { this.resolvedCrises = v; }
        public long getClosedCrises() { return closedCrises; }
        public void setClosedCrises(long v) { this.closedCrises = v; }
        public double getAvgResponseTimeMinutes() { return avgResponseTimeMinutes; }
        public void setAvgResponseTimeMinutes(double v) { this.avgResponseTimeMinutes = v; }
        public double getAvgResolutionTimeMinutes() { return avgResolutionTimeMinutes; }
        public void setAvgResolutionTimeMinutes(double v) { this.avgResolutionTimeMinutes = v; }
        public List<Map<String, Object>> getByCategory() { return byCategory; }
        public void setByCategory(List<Map<String, Object>> v) { this.byCategory = v; }
        public List<Map<String, Object>> getBySeverity() { return bySeverity; }
        public void setBySeverity(List<Map<String, Object>> v) { this.bySeverity = v; }
        public List<Map<String, Object>> getByStatus() { return byStatus; }
        public void setByStatus(List<Map<String, Object>> v) { this.byStatus = v; }
        public List<Map<String, Object>> getDailyTrend() { return dailyTrend; }
        public void setDailyTrend(List<Map<String, Object>> v) { this.dailyTrend = v; }
    }

    public static class ResponderDashboard {
        private long totalAssigned;
        private long newlyAssigned;
        private long accepted;
        private long inProgress;
        private long resolved;
        private long critical;

        public long getTotalAssigned() { return totalAssigned; }
        public void setTotalAssigned(long v) { this.totalAssigned = v; }
        public long getNewlyAssigned() { return newlyAssigned; }
        public void setNewlyAssigned(long v) { this.newlyAssigned = v; }
        public long getAccepted() { return accepted; }
        public void setAccepted(long v) { this.accepted = v; }
        public long getInProgress() { return inProgress; }
        public void setInProgress(long v) { this.inProgress = v; }
        public long getResolved() { return resolved; }
        public void setResolved(long v) { this.resolved = v; }
        public long getCritical() { return critical; }
        public void setCritical(long v) { this.critical = v; }
    }
}
