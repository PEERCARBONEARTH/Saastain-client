import { NextPageWithLayout } from '@/types/Layout';
import React, { useState } from 'react'
import AuthLayout from '@/layouts/AuthLayout';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppInput from "@/components/forms/AppInput";
import { Button, Checkbox, Spacer } from '@nextui-org/react';
import { Building2, Check, LockKeyholeIcon, MailCheck, User } from 'lucide-react';
import Link from 'next/link';
import { AppEnumRoutes } from '@/types/AppEnumRoutes';
import useAuthUtils from '@/hooks/useAuthUtils';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';


const schema = z
.object({
  name: z.string(),
  roleInCompany: z.string(),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  })
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register: NextPageWithLayout = () => {
  const {createCompanyAdmin} = useAuthUtils()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      roleInCompany: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods;

//define a submit handler
  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    const id = toast.loading("Creating Account...");
    try {
      const resp = await createCompanyAdmin(data.name, data.roleInCompany, data.email, data.password);
      console.log(resp);
      if (resp.status === 'success') {
        toast.success('Account Created Successfully', { id });
        reset();
        router.push('/auth/verify');
      } else {
				toast.error(resp.msg, {id});
      }
      
    } catch (error) {
      toast.error("An error occurred. Please try again", {id});
      setError(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container w-full md:w-5/6 p-4 md:p-8 mt-6 md:mt-24 my-auto'>
      <h1 className='text-3xl font-bold text-center'>Sign Up</h1>
      <Spacer y={4} />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppInput
            label="Name"
            name='name'
            placeholder="Enter your name"
            error={errors.name}
            control={control}
            startContent= {<User className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
          />
          <AppInput
            label="Email"
            name='email'
            placeholder="Enter your email"
            error={errors.email}
            control={control}
            startContent={<MailCheck className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
          />
          <AppInput
            label="Password"
            name='password'
            type='password'
            placeholder="Enter your password"
            error={errors.password}
            control={control}
            isPassword={true}
						startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
          />
          <AppInput
            label="Confirm Password"
            name='confirmPassword'
            type='password'
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            control={control}
            isPassword={true}
						startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
          />
        </div>
        <Spacer y={6} />
        
        <AppInput
            label="Role in Company"
            name='roleInCompany'
            placeholder="Enter your role in the company"
            error={errors.roleInCompany}
            control={control}
            startContent= {<Building2 className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3"/>}
          />

					<div className='mt-6'> 
          <Checkbox color="primary">I agree to the terms and conditions</Checkbox> 
	
          <Button type="submit" className='w-full mt-4' color="primary" isDisabled={loading} isLoading={loading}>
            Sign Up
          </Button>
          <p className="mt-6">
				Already have an  Account ? {" "}
				<Link href={AppEnumRoutes.AUTH_LOGIN} className="font-bold text-[#CFA16C] hover:underline hover:underline-offset-4">
					Login
				</Link>
			</p>
          </div>
        </form>


      </FormProvider>

    </div>
  )
}


Register.getLayout = (c) => <AuthLayout>{c}</AuthLayout>;


export default Register