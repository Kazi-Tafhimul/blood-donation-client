import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

import React from 'react';
import AdminVolunteerDashboardHome from './components/AdminAndVolunteerDashboard';
import DonorDashboardHome from './components/DonorDashboardHome';
import { headers } from "next/headers";

const DashboardPage = async () => {
     const session = await auth.api.getSession({
        headers: await headers(),
      });
    
    if(!session) redirect("/login");
    const user = session.user;
    const role = session.user.role || "donor";
    if (role === "admin" || role === "volunteer") {
    return <AdminVolunteerDashboardHome user={session.user} />;
    }

    return <DonorDashboardHome user={session.user} />;
}


    


export default DashboardPage;