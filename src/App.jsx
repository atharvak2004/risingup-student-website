import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import TheoryPage from "./pages/Theory/TheoryPage";
import TopicDetail from "./pages/Theory/TopicDetail";
import SubtopicDetail from "./pages/Theory/SubtopicDetail";
import CaseStudyList from "./pages/CaseStudy/CaseStudyList";
import CaseStudyDetail from "./pages/CaseStudy/CaseStudyDetail";
import Navbar from "./components/Navbar";
import StudentProfile from "./pages/StudentProfile";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-password" element={<ResetPassword />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/theory" element={<TheoryPage />} />
        <Route path="/topic" element={<TopicDetail />} />
        <Route path="/subtopic" element={<SubtopicDetail />} />
        <Route path="/case-studies" element={<CaseStudyList />} />
        <Route path="/case-study-detail" element={<CaseStudyDetail />} />
        <Route path="/profile" element={<StudentProfile/>} />
        <Route path="/profile/edit" element={<UpdateProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;