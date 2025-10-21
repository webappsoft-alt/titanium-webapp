import { useEffect, useState } from "react";
import {
  Menu,
  Phone,
  Mail,
  Calculator,
  Book,
  Search,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { useAuth } from "@/lib/redux/auth/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin, setLogout, setToken } from "@/lib/redux/loginForm";
import toast from "react-hot-toast";
import ApiFunction from "@/lib/api/apiFuntions";
import { setMenuItems } from "@/lib/redux/menuItem";
import { setCompetMarkup, setCountriesList, setStatesList } from "@/lib/redux/products";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const tableData = useSelector((state) => state.prod.tableData);
  const menuData = useSelector((state) => state.menu.items);
  const userData = useSelector((state) => state.auth.userData);
  const isAuthenticated = useAuth();
  const dispatch = useDispatch();
  const toolsMenuItems = [
    { label: "Weight Calculator", path: "/tools/calculator", icon: Calculator },
    { label: "Technical References", path: "/tools/references", icon: Book },
  ];
  const { get } = ApiFunction();
  const handleLogout = () => {
    dispatch(setLogout());
    push("/");
    toast.success("Logout successfully");
  };
  const countriesList = useSelector(state => state.prod.countriesList) || []
  const statesList = useSelector(state => state.prod.statesList) || []

  const handleGetStates = async (pageNo = 1) => {
    await get(`states/`)
      .then((result) => {
        if (result.success) {
          dispatch(setStatesList(result.data))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
      })
  }
  const handleGetCountries = async (pageNo = 1) => {
    await get(`countries/`)
      .then((result) => {
        if (result.success) {
          dispatch(setCountriesList(result.data))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
      })
  }

  const handleGetProduct = async () => {
    await get("prod-data/header")
      .then((result) => {
        if (result.success) {
          if (result.products?.length > 0) {
            const nData = [...menuData];
            nData[1] = {
              ...result.products[0],
              value: "/product?type=mill-product",
            };
            nData[2] = {
              ...result.products[1],
              value: "/product?type=pipe-fitting",
            };
            dispatch(setMenuItems(nData));
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleGetProduct();
    handleGetCountries()
    handleGetStates()
  }, []);

  const handleGetUser = async () => {
    await get("users/me", { page: pathname })
      .then((result) => {
        if (result.success) {
          if (result.user?.status === "active") {
            if (result.user?.type !== 'customer') {
              dispatch(setToken(result?.token));
            }
            dispatch(handleLogin(result.user));
            dispatch(setCompetMarkup(result?.data));
          } else {
            dispatch(setLogout());
            push("/");
            toast.info(
              "Account deactivated by admin. Please contact the admin for further support."
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (isLogin) {
      handleGetUser();
    }
  }, [pathname, isLogin]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-xl ">
      <div className="container">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-b">
          <div className="flex items-center space-x-3">
            <a
              href="tel:1-888-482-6486"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <Phone className="h-4 w-4 mr-1" />
              1-888-482-6486
            </a>
            <a
              href="mailto:sales@titanium.com"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <Mail className="h-4 w-4 mr-1" />
              sales@titanium.com
            </a>
          </div>

          <div className="flex items-center space-x-3">
            {toolsMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className="flex items-center text-sm max-xl:text-xs text-gray-600 hover:text-blue-600"
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4 border-l pl-2">
              <button className="text-gray-600 max-lg:hidden hover:text-blue-600">
                <Search className="h-4 w-4" />
              </button>
              <Link
                href="/customer/profile-account"
                className="text-gray-600  max-lg:hidden hover:text-blue-600"
              >
                <User className="h-4 w-4" />
              </Link>
              <Link
                href={"/customer/cart"}
                className="text-gray-600 hover:text-blue-600 relative"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {tableData?.length || 0}
                </span>
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              ) : (
                <Button
                  onClick={() => push("/auth/login")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/web-app-manifest-512x512.png"
                // src="https://nycrhythm.live/2.svg"
                alt="Titanium Industries"
                className="h-10 w-auto me-2"
              />
            </Link>
            {userData && (
              <Link
                href={
                  userData?.type === "customer"
                    ? "/customer/dashboard"
                    : "/dashboard/overview"
                }
                className="flex mr-2 items-center border font-semibold whitespace-nowrap justify-between px-3 py-2 xl:text-sm  max-xl:text-xs hover:bg-blue-50 rounded-md transition-colors"
              >
                My Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center xl:gap-8 gap-3">
            <MegaMenu />
            <Button
              onClick={() => push("/quick-quote")}
              size="sm"
              className="bg-[#0a1f3c] text-sm whitespace-nowrap  text-white shadow hover:bg-slate-900/90"
            >
              Create Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              onClick={() => push("/quick-quote")}
              size="sm"
              className="bg-[#0a1f3c]  text-white whitespace-nowrap shadow hover:bg-slate-900/90"
            >
              Create Quote
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
