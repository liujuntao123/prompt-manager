'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (token) {
      document.cookie = `authToken=${token}; path=/`;
      router.push('/prompts');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>登录系统</CardTitle>
          <CardDescription>请输入您的访问令牌</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="请输入访问令牌"
              />
            </div>
            <Button type="submit" className="w-full">
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 