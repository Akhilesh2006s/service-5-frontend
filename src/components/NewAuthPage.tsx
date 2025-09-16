import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_DEPARTMENTS } from '@/constants/categories';

export const NewAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' as 'citizen' | 'government' | 'admin' | 'worker',
    aadhaarNumber: '',
    location: '',
    department: '',
    designation: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(loginData.username, loginData.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...userData } = registerData;
      await register(userData);
      toast({
        title: "Registration Successful",
        description: "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (isLogin) {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl font-bold">🏛️</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Citizen Sphere
          </CardTitle>
          <CardDescription className="text-gray-600 text-base mt-2">
            Noida Municipal Corporation • Digital Governance Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Create Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-username" className="text-sm font-semibold text-gray-700">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-8">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username" className="text-sm font-semibold text-gray-700">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role" className="text-sm font-semibold text-gray-700">Account Type</Label>
                  <Select value={registerData.role} onValueChange={(value: 'citizen' | 'government' | 'admin' | 'worker') => handleInputChange('role', value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                      <SelectValue placeholder="Select your account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">👤 Citizen Account</SelectItem>
                      <SelectItem value="government" disabled>🏛️ Government Official (Admin Only)</SelectItem>
                      <SelectItem value="admin" disabled>🔧 System Administrator (Admin Only)</SelectItem>
                      <SelectItem value="worker" disabled>👷 Worker (Admin Only)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Only citizens can self-register. Other roles are created by administrators.</p>
                </div>
                
                {registerData.role === 'citizen' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="register-aadhaar" className="text-sm font-semibold text-gray-700">Aadhaar Number</Label>
                      <Input
                        id="register-aadhaar"
                        type="text"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={registerData.aadhaarNumber}
                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                        maxLength={12}
                        required
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-500">Required for citizen verification</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-location" className="text-sm font-semibold text-gray-700">Location</Label>
                      <Input
                        id="register-location"
                        type="text"
                        placeholder="Enter your location (e.g., Sector 15, Noida)"
                        value={registerData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      />
                    </div>
                  </>
                )}
                
                {(registerData.role === 'government' || registerData.role === 'admin' || registerData.role === 'worker') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="register-department" className="text-sm font-semibold text-gray-700">Department</Label>
                      <Select value={registerData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEFAULT_DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-designation" className="text-sm font-semibold text-gray-700">Designation</Label>
                      <Input
                        id="register-designation"
                        type="text"
                        placeholder="Enter your designation (e.g., Officer, Manager)"
                        value={registerData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={registerData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    minLength={6}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">Minimum 6 characters required</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    minLength={6}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>Secure</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>✓</span>
                  <span>Verified</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🏛️</span>
                  <span>Government Approved</span>
                </span>
              </div>
              <p className="text-xs text-gray-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
