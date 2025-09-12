"use client";

import { useTransition } from "react";
import { type City, type Clinic } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  handleCreateCity, 
  handleUpdateCity, 
  handleDeleteCity,
  handleCreateClinic,
  handleUpdateClinic,
  handleDeleteClinic
} from "@/app/actions/city-management";

export function CityForm({ city, onSuccess }: { city?: City, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!city || !confirm("آیا مطمئن هستید؟")) return;
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", city.id.toString());
      await handleDeleteCity(formData);
      onSuccess?.();
    });
  }

  return (
    <form 
      action={async (formData: FormData) => {
        startTransition(async () => {
          if (city) {
            await handleUpdateCity(formData);
          } else {
            await handleCreateCity(formData);
          }
          onSuccess?.();
        });
      }} 
      className="space-y-4"
    >
      {city && <input type="hidden" name="id" value={city.id} />}
      <div>
        <label className="block text-sm mb-1">نام شهر</label>
        <Input 
          name="name" 
          defaultValue={city?.name}
          className="w-full" 
          required 
        />
      </div>
      {city && (
        <div className="flex items-center gap-2">
          <Switch 
            name="isActive" 
            defaultChecked={city.isActive} 
          />
          <label className="text-sm">فعال</label>
        </div>
      )}
      <div className="flex justify-between">
        <Button type="submit" disabled={isPending}>
          {city ? "ویرایش" : "افزودن"}
        </Button>
        {city && (
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            حذف
          </Button>
        )}
      </div>
    </form>
  );
}

export function ClinicForm({ clinic, cities, onSuccess }: { clinic?: Pick<Clinic, 'id' | 'name' | 'address' | 'cityId'>, cities: City[], onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!clinic || !confirm("آیا مطمئن هستید؟")) return;
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", clinic.id.toString());
      await handleDeleteClinic(formData);
      onSuccess?.();
    });
  }

  return (
    <form 
      action={async (formData: FormData) => {
        startTransition(async () => {
          if (clinic) {
            await handleUpdateClinic(formData);
          } else {
            await handleCreateClinic(formData);
          }
          onSuccess?.();
        });
      }}
      className="space-y-4">
      <div>
        <label className="block text-sm mb-1">نام کلینیک</label>
        <Input 
          name="name" 
          defaultValue={clinic?.name}
          className="w-full" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm mb-1">آدرس</label>
        <Textarea 
          name="address" 
          defaultValue={clinic?.address}
          className="w-full" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm mb-1">شهر</label>
        <select 
          name="cityId" 
          defaultValue={clinic?.cityId}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          required
        >
          <option value="">انتخاب کنید</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <Button type="submit" disabled={isPending}>
          {clinic ? "ویرایش" : "افزودن"}
        </Button>
        {clinic && (
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            حذف
          </Button>
        )}
      </div>
    </form>
  );
}

export function CityList({ cities }: { cities: (City & { clinics: Clinic[] })[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">شهرها</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>افزودن شهر</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن شهر جدید</DialogTitle>
            </DialogHeader>
            <CityForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map(city => (
          <div key={city.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{city.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {city.clinics.length} کلینیک
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">ویرایش</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>ویرایش شهر</DialogTitle>
                  </DialogHeader>
                  <CityForm city={city} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {city.clinics.map(clinic => (
                <div key={clinic.id} className="text-sm border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span>{clinic.name}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">ویرایش</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ویرایش کلینیک</DialogTitle>
                        </DialogHeader>
                        <ClinicForm clinic={clinic} cities={cities} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">{clinic.address}</p>
                </div>
              ))}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  افزودن کلینیک
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>افزودن کلینیک جدید</DialogTitle>
                </DialogHeader>
                <ClinicForm cities={cities} />
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
