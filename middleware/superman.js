export default function({ $auth, redirect }) {
  if (!$auth.hasScope("superman")) {
    return redirect("/");
  }
}
