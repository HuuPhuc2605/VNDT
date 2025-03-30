import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-green-400 min-h-[80px] flex flex-row justify-center items-center space-x-12 text-white font-bold text-xl">
      <Link
        to=""
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        Home
      </Link>
      <Link
        to="/reducer"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        UseReducer
      </Link>
      <Link
        to="/ref"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        UseRef
      </Link>
      <Link
        to="/effect"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        UseEffect
      </Link>
      <Link
        to="/memo"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        memo
      </Link>
      <Link
        to="/callback"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        CallBack
      </Link>
      <Link
        to="/usememo"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        UseMemo
      </Link>
      <Link
        to="/usecontext"
        className="min-w-[150px] py-1 bg-green-600 hover:bg-green-700 text-white font-bold  text-center rounded-lg"
      >
        UseContext
      </Link>
    </div>
  );
};

export default Header;
