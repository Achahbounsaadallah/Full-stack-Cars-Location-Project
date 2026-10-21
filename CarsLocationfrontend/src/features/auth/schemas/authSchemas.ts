import { z } from 'zod'

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('validation.emailInvalid') })
      .email({ message: t('validation.emailInvalid') }),
    password: z
      .string()
      .min(1, { message: t('validation.passwordRequired') })
      .min(6, { message: t('validation.passwordMin') }),
    rememberMe: z.boolean().optional(),
  })

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>

export const createRegisterSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z
      .string()
      .min(2, { message: t('validation.firstNameRequired') })
      .max(50),
    lastName: z
      .string()
      .min(2, { message: t('validation.lastNameRequired') })
      .max(50),
    email: z
      .string()
      .min(1, { message: t('validation.emailInvalid') })
      .email({ message: t('validation.emailInvalid') }),
    password: z
      .string()
      .min(6, { message: t('validation.passwordMin') }),
    phone: z
      .string()
      .min(6, { message: t('validation.phoneInvalid') })
      .optional()
      .or(z.literal('')),
  })

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>
