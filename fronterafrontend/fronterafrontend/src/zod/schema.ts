import { validTime } from "../../lib/utils";
import z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .refine(
      (email: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
      { message: "Invalid email address" }
    ),
  password: z.string().min(1, { message: "Password not provided" }),
});

export const roomSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Room name cannot be empty" }),
  specializationID: z.number(),
  isDeleted: z.boolean().optional(),
});

export type TRoom = z.infer<typeof roomSchema>;

export const centerSchema = z.object({
  name: z.string().min(1, { message: "Center name cannot be empty" }),
  address: z.string().min(1, { message: "Address cannot be empty" }),
  poc: z.string().min(1, { message: "POC cannot be empty" }),
  contact: z.string().min(1, { message: "Contact cannot be empty" }),
  email: z
    .string()
    .min(1, { message: "Email cannot be empty" })
    .refine(
      (email: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
      { message: "Invalid email address" }
    ),
  regionID: z.number(),
  rooms: z
    .array(roomSchema)
    .min(1, { message: "Please add atleast one room to the center" })
    .default([]),
});

export type TCenter = z.infer<typeof centerSchema>;

export const shiftSchema = z
  .object({
    shiftType: z.string().min(0),
    shiftFromTime: z.string(),
    shiftToTime: z.string(),
  })
  .refine(
    ({ shiftFromTime, shiftToTime }) => validTime(shiftFromTime, shiftToTime),
    ({ shiftType }) => ({
      message: `${shiftType}: shift to time cannot be less than shift from time`,
    })
  );

export type TShift = z.infer<typeof shiftSchema>;

export const providerSchema = z.object({
  name: z.string().min(1, { message: "Provider's name cannot be empty" }),
  contact: z.string().min(1, { message: "Contact cannot be empty" }),
  email: z
    .string()
    .refine(
      (email: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
      { message: "Invalid email address" }
    ),
  availability: z
    .array(z.any())
    .min(1, {
      message:
        "Please select atleast one shift types and its corresponding timmings",
    })
    .default([]),
  preferrRoomID: z.number().optional().default(0),
  specializationID: z.number({
    required_error: "Please choose specialization",
  }),
  medicalCenterID: z.number({
    required_error: "Please choose associated medical center",
  }),
});

export type TProvider = z.infer<typeof providerSchema>;

export const shiftsSchema = z.array(shiftSchema);

export const requestSchema = z.object({
  participants: z.number().refine((p: number) => p !== null, {
    message: "Please choose participant",
  }),
  medicalCenterID: z.number().optional(),
  providerID: z.number().optional(),
  startDate: z.string().min(1, { message: "Please choose start date" }),
  endDate: z.string().min(1, { message: "Please choose end date" }),
  deadline: z.string().min(1, { message: "Please choose deadline" }),
  weekendsOff: z.boolean().default(false),
  holidayDates: z
    .array(
      z.string().min(1, {
        message:
          "Please pick holidays either each weekend or inidividual days.",
      })
    )
    .optional(),
});

export type TRequest = z.infer<typeof requestSchema>;
