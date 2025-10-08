// import { useForm, useFieldArray, FormProvider } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select } from "@/components/ui/select";
// import axios from "axios";

// const SeatAllocationForm = () => {
//   const methods = useForm({
//     defaultValues: {
//       screen: {
//         screen_name: "",
//         seating_capacity: 0,
//         user_id: 1, // you can dynamically assign this
//       },
//       screen_seat_class: {
//         seat_class: "Regular",
//         total_seat_count: 0,
//         price_per_seat: 0,
//       },
//       seat_setup: {
//         row_label: "",
//         seat_per_row: 0,
//       },
//       seat_number_allocation: [{ seat_number: "" }],
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     control,
//   } = methods;

//   const { fields, append } = useFieldArray({
//     control,
//     name: "seat_number_allocation",
//   });

//   const onSubmit = async (data: any) => {
//     try {
//       const res = await axios.post("/api/seat-allocations/full", data);
//       alert("Seat allocation saved successfully!");
//       console.log(res.data);
//     } catch (error) {
//       console.error("Error submitting seat allocation", error);
//     }
//   };

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-2xl mx-auto">

//         {/* Screen */}
//         <Input label="Screen Name" {...register("screen.screen_name")} />
//         <Input type="number" label="Seating Capacity" {...register("screen.seating_capacity")} />

//         {/* Seat Class */}
//         <Select label="Seat Class" {...register("screen_seat_class.seat_class")}>
//           <option value="Regular">Regular</option>
//           <option value="Premium">Premium</option>
//         </Select>
//         <Input type="number" label="Total Seat Count" {...register("screen_seat_class.total_seat_count")} />
//         <Input type="number" label="Price Per Seat" {...register("screen_seat_class.price_per_seat")} />

//         {/* Seat Setup */}
//         <Input label="Row Label" {...register("seat_setup.row_label")} />
//         <Input type="number" label="Seats Per Row" {...register("seat_setup.seat_per_row")} />

//         {/* Seat Numbers */}
//         {fields.map((field, index) => (
//           <Input
//             key={field.id}
//             label={`Seat #${index + 1}`}
//             {...register(`seat_number_allocation.${index}.seat_number`)}
//           />
//         ))}
//         <Button type="button" onClick={() => append({ seat_number: "" })}>Add Seat</Button>

//         <Button type="submit">Submit</Button>
//       </form>
//     </FormProvider>
//   );
// };

// export default SeatAllocationForm;
