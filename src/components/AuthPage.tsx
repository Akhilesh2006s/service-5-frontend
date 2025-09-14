
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthPageProps {
  onLogin: (userData: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'welcome' | 'aadhaar' | 'digilocker'>('welcome');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleAadhaarSubmit = () => {
    if (aadhaarNumber.length === 12) {
      setStep('digilocker');
    }
  };

  const handleDigiLockerAuth = () => {
    // Simulate successful authentication
    onLogin({
      name: 'Rajesh Kumar',
      aadhaar: aadhaarNumber,
      location: 'Sector 15, Noida',
      verified: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">CS</span>
          </div>
          <CardTitle className="text-2xl">Citizen Sphere</CardTitle>
          <CardDescription>Government Demo Platform - Noida Municipal Corporation</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 'welcome' && (
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <h3 className="font-semibold">Secure Government Platform Access</h3>
                <p className="text-sm text-gray-600">
                  Login with Aadhaar and DigiLocker for verified citizen access
                </p>
                
                {/* Demo Benefits */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                  <h4 className="font-medium text-blue-800 mb-2">🏛️ Platform Features:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>✓ 100% Verified Citizens Only</li>
                    <li>✓ Real-time Issue Tracking</li>
                    <li>✓ Government Response System</li>
                    <li>✓ Video Evidence Authentication</li>
                    <li>✓ Location-based Engagement</li>
                  </ul>
                </div>
              </div>
              <Button 
                onClick={() => setStep('aadhaar')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue with Aadhaar (Demo)
              </Button>
              <p className="text-xs text-gray-500 text-center">
                🔒 Secure • Verified • Government Approved
              </p>
            </div>
          )}

          {step === 'aadhaar' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  maxLength={12}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Demo: Use any 12-digit number
                </p>
              </div>
              <Button 
                onClick={handleAadhaarSubmit} 
                disabled={aadhaarNumber.length !== 12}
                className="w-full"
              >
                Verify Aadhaar (Demo)
              </Button>
            </div>
          )}

          {step === 'digilocker' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">DigiLocker Verification</h3>
                <p className="text-sm text-gray-600">
                  Complete verification with your DigiLocker account
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ Aadhaar verified successfully
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Connecting to DigiLocker API...
                </p>
              </div>
              
              {/* Government Stats */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Platform Stats:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <div>
                    <div className="font-bold">2,847</div>
                    <div>Verified Citizens</div>
                  </div>
                  <div>
                    <div className="font-bold">91%</div>
                    <div>Issue Resolution</div>
                  </div>
                  <div>
                    <div className="font-bold">4.6/5</div>
                    <div>Satisfaction Score</div>
                  </div>
                  <div>
                    <div className="font-bold">72 hrs</div>
                    <div>Avg Response</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleDigiLockerAuth}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Complete DigiLocker Verification (Demo)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
