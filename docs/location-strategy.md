# Location Coverage

## Current Coverage

### Upazila Coverage

- All Bangladesh upazilas (~500)

### City Coverage

#### Dhaka

Major areas:

- Uttara
- Mirpur
- Gulshan
- Dhanmondi
- Mohammadpur
- Banani
- Badda
  ...

Additional sub-zones:

- Uttara Sector 3
- Uttara Sector 7
- Mirpur 10
- Mirpur 11
- Gulshan 1
- Gulshan 2
  ...

#### Sylhet

Major areas:

- Zindabazar
- Chouhatta
- Mirabazar
- Amberkhana
- Kadamtali
- Uposhohor
  ...

Additional sub-zones:

- Bandarbazar
- Dargah Gate
- Naydorpul
- Subidbazar
- Pathantula
- Kajirbazar
  ...

#### Other Cities

- Chattogram
- Khulna
- Rajshahi
- Barishal
- Rangpur
- Mymensingh
- Narayanganj
- Gazipur
- Cumilla

---

## Current Granularity

Current location records may represent:

- Upazila
- Major city area
- Popular urban sub-zone

Examples:

- Fenchuganj, Sylhet
- Dhanmondi, Dhaka
- Zindabazar, Sylhet

---

## Future Expansion

### Phase 2

More city sub-zones.

Examples:

- Ghilachora, Fenchuganj
- Maijgaon, Fenchuganj
- Tilagor, Sylhet

### Phase 3

Rural coverage.

- Union
- Village

### Phase 4

Community submitted locations.

User Suggestion
↓
Admin Review
↓
Approval
↓
Database

---

## Location Schema

```ts
{
  area: string;
  district: string;

  coordinates: {
    type: "Point";
    coordinates: [lng, lat];
  }
}
```
