import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import "./App.css";

const width = 512;
const height = 255;
let titles = {};

function App() {
  const [png, setPng] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#888888");
  const [textColor, setTxColor] = useState<string>("#010101");
  const [isVisibleBG, setIsVisibleBG] = useState(false);
  const [isVisibleTX, setIsVisibleTX] = useState(false);
  const toggleVisibilityBG = () => {
    setIsVisibleBG(!isVisibleBG);
  };
  const toggleVisibilityTX = () => {
    setIsVisibleTX(!isVisibleTX);
  };
  useEffect(() => {
    const canvasElem = document.createElement("canvas");
    canvasElem.width = width * 2;
    canvasElem.height = height * 2;
    const ctx = canvasElem.getContext("2d");

    // draw

    ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasElem.width, canvasElem.height);

    ctx.fillStyle = textColor;
    for (let i = 0; i < Object.keys(titles).length; i++) {
      let x = 100;
      ctx.fillText(titles[i].text, x, 300);
      x = x + 200;
    }
    setPng(canvasElem.toDataURL());
  }, [bgColor, setBgColor, textColor]);

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  function dissableClick(e) {
    e.preventDefault(); // これが必要
  }
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      titles: [
        {
          text: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "titles",
  });
  const onSubmit = (data) => {
    titles = data.titles;
    console.log(JSON.stringify(titles));
  };
  const changeBgColor = (color: ColorResult) => {
    setBgColor(color.hex);
  };

  const changeTxColor = (color: ColorResult) => {
    setTxColor(color.hex);
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
              <img alt="icon" src={png} height={height} width={width} />
            </div>
          )}
        </div>
        <div className="separate">
          <div className="left">
            <form onSubmit={handleSubmit(onSubmit)}>
              <button
                className="addSingle"
                onClick={(e) => {
                  append({ text: "" });
                  dissableClick(e);
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
                        {...register(`titles.${index}.text`)}
                      />
                      <button
                        className="remove"
                        onClick={(e) => {
                          remove(index);
                          dissableClick(e);
                        }}
                      >
                        削除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="submit">反映</button>
            </form>
          </div>
          <div className="right">
            <div className="ChangeBG">
              <button onClick={toggleVisibilityBG}>背景色</button>
              {isVisibleBG && (
                <CompactPicker
                  className="picker"
                  onChange={changeBgColor}
                ></CompactPicker>
              )}
            </div>
            <div className="ChangeTX">
              <button onClick={toggleVisibilityTX}>テキスト色</button>
              {isVisibleTX && (
                <CompactPicker
                  className="picker"
                  onChange={changeTxColor}
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
