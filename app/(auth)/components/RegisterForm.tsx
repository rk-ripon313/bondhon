"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS, GENDERS } from "@/constants";

// demo suggestions
const LOCATION_SUGGESTIONS = [
  "Netrakona",
  "Mymensingh",
  "Dhaka",
  "Sylhet",
  "Kishoreganj",
];

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    phone: "",
    bloodGroup: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    locationInput: "",
    locationTags: [] as string[],
    isAvailableForDonate: false,
    acceptTerms: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addLocationTag = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return;
    if (form.locationTags.includes(trimmed)) return;
    if (form.locationTags.length >= 3) return;

    setForm((prev) => ({
      ...prev,
      locationTags: [...prev.locationTags, trimmed],
      locationInput: "",
    }));
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      locationTags: prev.locationTags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!form.acceptTerms) {
      alert("Please accept Terms");
      return;
    }

    console.log(form);
  };

  const filteredSuggestions = LOCATION_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(form.locationInput.toLowerCase()),
  );

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <Input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />
      <Input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
      />

      {/* Nick + Phone */}
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          name="nickname"
          placeholder="Nickname"
          value={form.nickname}
          onChange={handleChange}
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      {/* Blood + Gender + DOB */}
      <div className="grid gap-3 md:grid-cols-3">
        <Select
          onValueChange={(value) =>
            setForm((p) => ({ ...p, bloodGroup: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Blood Group" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_GROUPS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setForm((p) => ({ ...p, gender: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            {GENDERS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />
      </div>

      {/* Location */}
      <div className="space-y-2 relative">
        <Input
          name="locationInput"
          placeholder="Location (District, Area , Address)"
          value={form.locationInput}
          onChange={(e) => {
            handleChange(e);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLocationTag(form.locationInput);
            }
          }}
        />

        {/* Suggestions */}
        {showSuggestions && form.locationInput && (
          <div className="absolute z-10 w-full rounded-md border bg-card shadow-md">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    addLocationTag(item);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No match found
              </div>
            )}
          </div>
        )}

        {/* Selected Locations  */}
        {form.locationTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.locationTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="relative">
          <Input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Input
            type={showConfirmPass ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="available"
            checked={form.isAvailableForDonate}
            onCheckedChange={(checked) =>
              setForm((p) => ({ ...p, isAvailableForDonate: !!checked }))
            }
          />
          <label className="text-sm text-muted-foreground">
            Available for blood donation
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={form.acceptTerms}
            onCheckedChange={(checked) =>
              setForm((p) => ({ ...p, acceptTerms: !!checked }))
            }
          />
          <label className="text-sm text-muted-foreground">
            I agree to Terms & Privacy Policy
          </label>
        </div>
      </div>

      <Button className="w-full bg-app-primary hover:bg-app-primary/90 py-2 rounded-md cursor-pointer">
        Create Account
      </Button>
    </form>
  );
}
