import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await updateProfile({
        name,
        email,
        phone,
        address,
        avatar,
      });

      if (success) {
        toast({
          title: "Success",
          description: "Your profile has been updated",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Button
          variant="ghost"
          className="mb-4 flex items-center text-primary"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="w-16 h-16 text-primary/50" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      className="pl-10"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
