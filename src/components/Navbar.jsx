import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const checkAuth = () => {
    try {
      const access = localStorage.getItem("access");
      const user = JSON.parse(localStorage.getItem("user"));

      if (access) {
        setIsLoggedIn(true);
        setRole(user?.role || null);
      } else {
        setIsLoggedIn(false);
        setRole(null);
      }
    } catch {
      setIsLoggedIn(false);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("authChanged", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, [user]);

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      if (refresh) {
        await API.post("/logout/", { refresh });
      }
    } catch (e) {
      console.log("Logout API failed, clearing locally...");
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    delete API.defaults.headers.common["Authorization"];

    setIsLoggedIn(false);
    setRole(null);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <div className="w-full bg-white border-b px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">

      {/* LOGO */}
      <div className="flex items-center gap-2 md:gap-3">
        <img src="/Logo.png" alt="Logo" className="h-8 md:h-10" />
        <h1 className="text-lg md:text-xl font-bold">RisingUp ERP</h1>
      </div>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-muted-foreground hover:text-black">
          Home
        </Link>

        <Link to="/profile" className="text-muted-foreground hover:text-black">
          Profile
        </Link>

        {isLoggedIn ? (
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[280px] p-0 flex flex-col bg-white">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>

            <div className="flex flex-col gap-4 px-5 py-6">
              <SheetClose asChild>
                <Link to="/">Home</Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/profile">Profile</Link>
              </SheetClose>
            </div>

            <div className="mt-auto px-5 pb-6">
              {isLoggedIn ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}