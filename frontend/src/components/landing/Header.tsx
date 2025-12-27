"use client";
import { Bell, Calendar, Settings, Stethoscope, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  showDashboardNav?: boolean;
}

interface NavigationItem {
  lable: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
}

function Header({ showDashboardNav = false }: HeaderProps) {
  const user = {
    type: "patient",
    name: "Yaksh",
    profileImage:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    email: "yaksh847@gmail.com",
  };
  const pathName = usePathname();
  const isAuthnticated = false;

  const getDashboardNavigation = (): NavigationItem[] => {
    if (!user || !showDashboardNav) {
      return [];
    }

    if (user.type === "patient") {
      return [
        {
          lable: "Appoinments",
          icon: Calendar,
          href: "/patient/dashboard",
          active: pathName.includes("/patient/dashboard") || false,
        },
      ];
    } else if (user.type === "doctor") {
      return [
        {
          lable: "Dashboard",
          icon: Calendar,
          href: "/doctor/dashboard",
          active: pathName.includes("/doctor/dashboard") || false,
        },
        {
          lable: "Appoinments",
          icon: Calendar,
          href: "/doctor/appoinments",
          active: pathName.includes("/doctor/appoinments") || false,
        },
      ];
    }
    return [];
  };

  return (
    <header className="border-b bg-whte/95 backdrop:blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href={"/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white w-5 h-5" />
            </div>

            <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Vaidya Verse+
            </div>
          </Link>

          {/* Dashboard Navigation */}
          {isAuthnticated && !showDashboardNav && (
            <nav className="hidden md:flex items-center space-x-6">
              {getDashboardNavigation().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-colors ${
                    item.active
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.lable}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
        {isAuthnticated && showDashboardNav ? (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-600">
                4
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="flex items-center space-x-2 px-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user.profileImage}
                      alt={user.name}
                    ></AvatarImage>
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.type}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.profileImage}
                        alt={user.name}
                      ></AvatarImage>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      <div className="flex-1 min-w-0 ">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[140px]">
                          {user.email}
                        </p>
                      </div>
                    </Avatar>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${user.type}/profile`}
                    className="flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/${user.type}/settings`}
                  className="flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            {!isAuthnticated ? (
              <>
                <Link href="/login/patient">
                  <Button
                    variant={"ghost"}
                    className="text-blue-900 font-medium hover:text-blue-700"
                  >
                    Log in
                  </Button>
                </Link>

                <Link href="/signup/patient" className="hidden md:block">
                  <Button className="bg-gradient-to-r to-blue-700 from-blue-600 font-medium hover:from-blue-700 hover:to-blue-800 rounded-2xl px-6">
                    Book Consultation
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="hidden md:block text-sm text-gray-700 font-medium whitespace-nowrap">
                  Welcome!,&nbsp;{user?.name}
                </span>
                <Link
                  href={`/${user.type}/dashboard`}
                  className="hidden md:block"
                >
                  <Button
                    variant={"ghost"}
                    className="text-blue-900 font-medium hover:text-blue-700"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
