import CustomInput from "@/components/CustomInput";

export default function Login() {
  return (
    <div>
      <h3 className="mb-4"> Welcome, login to continue </h3>
      <form className="w-full">
        <CustomInput type="text" className="w-full" placeholder="Username"/>
        <CustomInput className="w-full" type="password" placeholder="Password" />
        <button type="submit" className="button secondary w-full">Login</button>
      </form>
    </div>
  );
}
