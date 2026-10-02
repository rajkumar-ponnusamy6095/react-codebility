import ErrorPage from "../../components/ErrorPage/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist."
      buttonText="Go to Dashboard"
      buttonPath="/dashboard"
    />
  );
}
