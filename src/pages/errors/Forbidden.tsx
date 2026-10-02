import ErrorPage from "../../components/ErrorPage/ErrorPage";

export default function Forbidden() {
  return (
    <ErrorPage
      code={403}
      title="Forbidden"
      message="You are authenticated, but you don't have permission to access this resource."
      buttonText="Back to Dashboard"
      buttonPath="/dashboard"
    />
  );
}
