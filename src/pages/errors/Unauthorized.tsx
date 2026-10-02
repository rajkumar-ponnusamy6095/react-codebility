import ErrorPage from "../../components/ErrorPage/ErrorPage";

export default function Unauthorized() {
  return (
    <ErrorPage
      code={401}
      title="Unauthorized"
      message="You need to be authenticated to access this resource."
      buttonText="Go to Login"
      buttonPath="/login"
    />
  );
}
