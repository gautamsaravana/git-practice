import React from "react";
import { Container } from "react-bootstrap";
import { FooterPage } from "./Footer";

export const AdminDashboard = () => {
    return (
        <div  style={{display:'flex' , flexDirection:'column' , minHeight:'100vh'}}>
            <Container className="flex-grow-1">
                <h2 className="text-center text-primary mt-5">Admin Dashboard</h2>
                <p className="text-center">Welcome, Admin! Manage your platform here.</p>
            </Container>

            <footer>
                <FooterPage />
            </footer>
        </div>
    );
};
