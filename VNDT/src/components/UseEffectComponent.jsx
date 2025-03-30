import { useEffect, useState } from "react";

function UseEffectComponent() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://67ca6b86102d684575c5483b.mockapi.io/Review")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  }, []);

  const handleXoa = async (id) => {
    const response = await fetch(
      `https://67ca6b86102d684575c5483b.mockapi.io/Review/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setData(data.filter((da) => da.id !== id));
    }
  };
  const handleThem = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://67ca6b86102d684575c5483b.mockapi.io/Review",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (response.ok) {
      const post = await response.json();
      setData([...data, post]);
    }

    setForm({ title: "", description: "" });
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-slate-900">
        Thêm công việc mới
      </h1>
      <form
        onSubmit={handleThem}
        className="text-2xl rounded-xl mx-auto flex flex-col gap-4 items-center mt-4 w-2/3 border-4 bg-slate-300 justify-between border-slate-500 px-4 py-4"
      >
        <input
          type="text"
          name="title"
          value={data.title}
          id="title"
          onChange={handleChange}
          className="border-2 border-gray-500 rounded-lg px-3 py-2 w-2/5 text-center"
          placeholder="Nhập tiêu đề công việc"
        />
        <br />
        <input
          type="text"
          name="description"
          value={data.description}
          id="description"
          onChange={handleChange}
          className="border-2 border-gray-500 rounded-lg px-3 py-2 w-2/5 text-center"
          placeholder="Nhập mô tả công việc"
        />
        <button type="submit" className="rounded-xl bg-sky-700 w-32 py-2">
          Thêm
        </button>
      </form>
      <h1 className="text-3xl text-center -text-slate-900 font-bold">
        Danh sách công việc
      </h1>
      <div className=" my-12 grid grid-cols-4 gap-2 w-8/12 mx-auto ">
        {/*my (margin-y): Thiết lập margin trên và dưới.
        mx (margin-x): Thiết lập margin trái và phải.*/}
        {data.map((post) => (
          <div
            className="flex flex-col justify-between  mb-4  text-2xl bg-slate-300 px-2 py-2 rounded-xl border-2 border-gray-500  shadow-xl shadow-stone-700 mb-4"
            key={post.id}
          >
            <p className="text-lg font-semibold">{post.title}</p>
            <p className="text-gray-700"> Sở thích: {post.description}</p>
            <br />
            <button
              onClick={() => handleXoa(post.id)}
              className="w-2/5 bg-red-500 rounded-xl hover:bg-blue-300 px-2 py-1 "
            >
              Xoá
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default UseEffectComponent;
