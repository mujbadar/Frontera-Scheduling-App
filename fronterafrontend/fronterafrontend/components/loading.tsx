import {AiOutlineLoading3Quarters} from "react-icons/ai";

export default function Loading({
                                    message,
                                    vertical,
                                    contained
                                }: {
    message?: string;
    vertical?: boolean;
    contained?: boolean
}) {
    return (
        <div
            className={`${contained ? "max-w-max" : "w-full"} flex ${
                vertical ? "" : "flex-col"
            } gap-2 items-center justify-center`}
        >
            <AiOutlineLoading3Quarters className="animate-spin"/>
            {message ? (
                <p className="text-lg text-gray-800 font-semibold">{message}</p>
            ) : null}
        </div>
    );
}
