import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// Helper function to fetch dashboard metrics
export const fetchDashboardMetrics = async () => {
    try {
        if (!db) {
            console.warn("Firebase not initialized. Returning empty metrics.");
            return { todaysPatients: 0, todaysRevenue: 0, pendingAppointments: 0, cancelledAppointments: 0, recentAppointments: [] };
        }
        const appointmentsRef = collection(db, "appointments");

        // Get today's start and end date strings for comparison
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];

        // 1. Fetch Today's Appointments
        const todayQuery = query(appointmentsRef, where("appointmentDate", "==", dateString));
        const todaySnapshot = await getDocs(todayQuery);
        let todaysPatients = 0;
        let todaysRevenue = 0;

        todaySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status !== "Cancelled") {
                todaysPatients++;
            }
            if (data.paymentStatus === "Paid") {
                // Use dynamic amount if available, otherwise fallback to 1000
                todaysRevenue += data.amount || 1000;
            }
        });

        // 2. Fetch Pending Appointments
        const pendingQuery = query(appointmentsRef, where("status", "==", "Pending Payment"));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingAppointments = pendingSnapshot.size;

        // 3. Fetch Cancelled Appointments
        const cancelledQuery = query(appointmentsRef, where("status", "==", "Cancelled"));
        const cancelledSnapshot = await getDocs(cancelledQuery);
        const cancelledAppointments = cancelledSnapshot.size;

        // 4. Fetch All Recent Appointments for List
        const recentQuery = query(appointmentsRef, orderBy("createdAt", "desc"));
        const recentSnapshot = await getDocs(recentQuery);
        const recentAppointments = recentSnapshot.docs.slice(0, 5).map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            todaysPatients,
            todaysRevenue,
            pendingAppointments,
            cancelledAppointments,
            recentAppointments
        };

    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return {
            todaysPatients: 0,
            todaysRevenue: 0,
            pendingAppointments: 0,
            cancelledAppointments: 0,
            recentAppointments: []
        };
    }
};
