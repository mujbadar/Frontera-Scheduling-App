export default function ValidationError({ message }: { message: string }) {
  return (
    <p className={"w-full text-red-700 text-lg font-semibold"}>{message}</p>
  );
}