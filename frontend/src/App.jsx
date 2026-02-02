import React from "react";
import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn, UserProfile } from "@clerk/clerk-react";
import Editor from "./pages/Editor";
import About from "./pages/About";
import Features from "./pages/Features";
import Background from "./components/CosmicBackground";

const App = () => {
  return (
    <>

      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
       

        <Route path="/sign-in/*" element={<SignIn routing="path" path="/" />} />
        

        <Route path="/sign-up/*" element={<SignUp routing="path" path="/" />} />
        

        {/* Clerk profile: show built-in profile when signed in, otherwise redirect */}
        <Route
          path="/profile/*"
          element={
            <>
              <SignedIn>
                <UserProfile routing="path" path="/profile" />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* 🟩 If user is signed in, allow access to editor */}
        

        <Route
          path="/editor/:id"
          element={
            <SignedIn>
              <Editor />
            </SignedIn>
          }
        />

        {/* 🟥 If user not signed in, redirect them */}
        <Route
          path="/editor/*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />

        <Route path="*" element={<NoPage />} />

        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </>
  );
};

export default App;
