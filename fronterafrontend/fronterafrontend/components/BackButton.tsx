import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = { title: string; to: string };

function BackButton({ title, to }: Props) {
  return (
    <Link
      to={to}
      className="min-w-max flex items-center gap-2 py-2 rounded-lg px-4 border border-hms-green-light "
    >
      <FaArrowCircleLeft /> {title}
    </Link>
  );
}

export default BackButton;
