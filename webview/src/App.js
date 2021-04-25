import './App.scss';
import './base/scroll-bar.scss';
import './base/userSelect.scss';

import {useState, useEffect} from 'react';
import { ChromePicker } from 'react-color'

import TypeSelector from './components/TypeSelector';
import RangeController from './components/RangeController';
import PointInf from './components/PointInf';


function App({vscode}) {
    const [type, setType] = useState(0);
    const [angle, setAngle] = useState(45);

    const [colorPicker, setColorPicker] = useState({x: -1, y: -1});
    const [selectedValue, setSelectedValue] = useState(-1);

    const [values, setValues] = useState(
        [
            {
                color: '#e74c3c',
                x: 0,
                r: '255',
                g: '59',
                b: '48',
                a: '1'
            },
            {
                color: '#4B29D2',
                x: 50,
                r: '75',
                g: '41',
                b: '210',
                a: '1'
            }, 
            {
                color: '#3498db',
                x: 100,
                r: '10',
                g: '132',
                b: '255',
                a: '1'
            }, 
        ]
    );


    useEffect(() => {
        try{
            let generatedFunction = generateFunction();
            vscode.postMessage({
                command: 'css-code',
                text: `background: -moz-${generatedFunction};\r\nbackground: -webkit-${generatedFunction};\r\nbackground: ${generatedFunction};`
            });
        }catch(e){

        }
    }, [values, angle, type]);

    let changeColor = (index, value) => {
        let colorValues = [...values];
        colorValues[index] = value;

        setValues(colorValues);
    };

    let removeValue = (index) => {
        let colorValues = [...values];
        colorValues.splice(index, 1);

        setValues(colorValues);
    }

    let generateFunction = () => {
        return `${type == 0 ? 'linear' : 'radial'}-gradient(${type == 0 ? `${angle}deg` : 'circle'} ,${values.map(item => `rgba(${item.r}, ${item.g}, ${item.b}, ${item.a}) ${item.x}%`)})`;
    }

    let _colorPickerPos = element => {
        let rect = element.current.getBoundingClientRect();
        setColorPicker({x: rect.x + rect.width - 50, y: rect.y - 200}); 
    }

    return (
        <div className="App">
            <div 
                style={{
                    position: 'absolute',
                    zIndex: 100,
                    left: colorPicker.x,
                    top: colorPicker.y,
                }}
            >
                {selectedValue != -1 ?
                    <>
                        <div
                            style={{
                                position: 'fixed',
                                top: '0px',
                                right: '0px',
                                bottom: '0px',
                                left: '0px'
                            }}

                            onClick={() => setSelectedValue(-1)}
                        />
                        <ChromePicker
                            color={{
                                r: values[selectedValue].r,
                                g: values[selectedValue].g,
                                b: values[selectedValue].b,
                                a: values[selectedValue].a,
                            }}
                            onChange={(rgb) => {
                                let _value = {...values[selectedValue]};
                                _value.color = rgb.hex;
                                _value.r = rgb.rgb.r;
                                _value.g = rgb.rgb.g;
                                _value.b = rgb.rgb.b;
                                _value.a = rgb.rgb.a;

                                changeColor(selectedValue, _value);
                            }}
                        />
                    </>
                : null}
            </div>
            <div className="bg-preview">
                <div
                    className="bg-preview-content"
                    style={{
                        background: generateFunction()
                    }}
                >
                </div>
                <TypeSelector type={type} setType={setType} />
            </div>
            <div className="control">
                <RangeController type={type} values={values} setValues={setValues} angle={angle} setAngle={setAngle}/>
                <div className="points section">
                <div className="section-title">Color Information</div>
                    <div className="points-wrapper">
                        {values.map((item, index) => 
                            <PointInf
                                value={item}

                                onClick={(element) => {
                                    setSelectedValue(index);
                                    
                                    _colorPickerPos(element);

                                    window.addEventListener('resize',  () => {
                                        _colorPickerPos(element);
                                    });
                                }}

                                removeAction={() => removeValue(index)}
                                changeValue={value => {
                                    changeColor(index, value);
                                }}
                                removeEnabled={values.length > 2}
                                index={index}
                                key={index}
                                selected={index == selectedValue}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
