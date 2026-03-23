import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import "./App.css";

const width = 512;
const height = 255;

function App() {
  const [png, setPng] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#888888");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const canvasElem = document.createElement("canvas");
    canvasElem.width = width;
    canvasElem.height = height;
    const ctx = canvasElem.getContext("2d");

    // draw

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    setPng(canvasElem.toDataURL());
  }, [bgColor, setBgColor]);

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  function handleSubmit(e) {
    e.preventDefault(); // これが必要
  }
  const { register, control } = useForm({
    defaultValues: {
      sample: [
        {
          title: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sample",
  });
  const changeTextColor = (color: ColorResult) => {
    setBgColor(color.hex);
  };

  return (
    <>
      <div className={`Mode ${darkMode ? "dark" : "light"}`}>
        <button className="ToggleButton" onClick={toggleDarkMode}>
          {darkMode ? <i>🌙</i> : <i>☀️</i>}
        </button>
        <br />
        <h1 className="header">CardMaker</h1>
        <div className="preview">
          {png && (
            <div className="comp" style={{ display: "flex" }}>
              <img alt="icon" src={png} />
            </div>
          )}
        </div>
        <div className="separate">
          <div className="left">
            <form>
              <button
                className="addSingle"
                onClick={(e) => {
                  append({ title: "" });
                  handleSubmit(e);
                }}
              >
                追加
              </button>
              <ul className="Inputs">
                {fields.map((field: any, index: number) => (
                  <li key={index}>
                    <div className="single" key={field.id}>
                      <input
                        type="text"
                        {...register(`sample.${index}.title`)}
                      />
                      <button
                        className="remove"
                        onClick={(e) => {
                          remove(index);
                          handleSubmit(e);
                        }}
                      >
                        削除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </form>
          </div>
          <div className="right">
            <div className="ChangeBG">
              <button onClick={toggleVisibility}>背景</button>
              {isVisible && (
                <CompactPicker
                  className="picker"
                  onChange={changeTextColor}
                ></CompactPicker>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
