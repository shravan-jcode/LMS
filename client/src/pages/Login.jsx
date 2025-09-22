import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "../components/ui/switch";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };
  
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
      setActiveTab("login");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup Failed");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Login Failed");
    }
  }, [
    loginIsSuccess,
    registerIsSuccess,
    loginData,
    registerData,
    loginError,
    registerError,
    navigate,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs Header */}
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-200 p-1 shadow-sm dark:bg-gray-800/50">
            <TabsTrigger
              value="signup"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-teal-600 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-teal-400"
            >
              Signup
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-teal-600 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-teal-400"
            >
              Login
            </TabsTrigger>
          </TabsList>

          {/* Signup Card */}
          <TabsContent value="signup">
            <Card className="mt-6 shadow-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950/80 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Fill in the details below to create your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-300">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. John Doe"
                    className="dark:bg-gray-800 dark:text-gray-200 focus:border-teal-500 focus-visible:ring-teal-400 transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. john@gmail.com"
                    className="dark:bg-gray-800 dark:text-gray-200 focus:border-teal-500 focus-visible:ring-teal-400 transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={signupInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter password"
                    className="dark:bg-gray-800 dark:text-gray-200 focus:border-teal-500 focus-visible:ring-teal-400 transition"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300 shadow-sm hover:shadow-md text-white font-semibold"
                  disabled={registerIsLoading}
                  onClick={() => handleRegistration("signup")}
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Login Card */}
          <TabsContent value="login">
            <Card className="mt-6 shadow-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950/80 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Enter your credentials to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Eg. john@gmail.com"
                    className="dark:bg-gray-800 dark:text-gray-200 focus:border-teal-500 focus-visible:ring-teal-400 transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter password"
                    className="dark:bg-gray-800 dark:text-gray-200 focus:border-teal-500 focus-visible:ring-teal-400 transition"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300 shadow-sm hover:shadow-md text-white font-semibold"
                  disabled={loginIsLoading}
                  onClick={() => handleRegistration("login")}
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;