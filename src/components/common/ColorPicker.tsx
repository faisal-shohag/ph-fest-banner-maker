import Sketch from '@uiw/react-color-sketch';
const ColorPicker = ({handleColorPicker}) => {
    return (
        <div className='flex justify-center'>
            <Sketch onChange={(color) => handleColorPicker(color)}/>
        </div>
    );
};

export default ColorPicker;