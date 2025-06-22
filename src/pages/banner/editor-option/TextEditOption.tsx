import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCanvas } from "@/hooks/use-canvas";
import { fontFamily, fontSizes, textAlignOptions } from "@/lib/constants";
import { debounce } from "lodash";
import { Italic, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImBold } from "react-icons/im";

const TextEditOption = () => {
  const { textOptionsApply, fabCanvas, openTextOptions, setOpenTextOption } =
    useCanvas();
  const [textAlignIndex, setTextAlignIndex] = useState(0);
  const [textAlign, setTextAlign] = useState(textAlignOptions[0]);
  const [textOptions, setTextOptions] = useState({
    fontFamily: "",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    linethrough: false,
    fill: "#000000",
    textAlign: "left",
    fontSize: 16,
  });

  // Debounced state update to prevent excessive re-renders
  const debouncedUpdateState = useMemo(
    () =>
      debounce((styles) => {
        setTextOptions((prev) => ({ ...prev, ...styles }));
      }, 50),
    []
  );

  // Memoized function to get current text styles
  const getCurrentTextStyles = useCallback(() => {
    if (!fabCanvas) return null;

    const activeObject = fabCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== "textbox") return null;

    const textBox: any = activeObject;
    let selectionStart = textBox.selectionStart ?? 0;
    let selectionEnd = textBox.selectionEnd ?? textBox.text?.length ?? 0;

    // If no selection, get styles from first character or textbox defaults
    if (selectionStart === selectionEnd) {
      selectionStart = 0;
      selectionEnd = Math.min(1, textBox.text?.length ?? 0);
    }

    const selectionStyles = textBox.getSelectionStyles(
      selectionStart,
      selectionEnd
    );
    const firstCharStyle = selectionStyles[0] || {};

    return {
      fontFamily: firstCharStyle.fontFamily || textBox.fontFamily || "",
      fontWeight: firstCharStyle.fontWeight || textBox.fontWeight || "normal",
      fontStyle: firstCharStyle.fontStyle || textBox.fontStyle || "normal",
      underline: Boolean(firstCharStyle.underline || textBox.underline),
      linethrough: Boolean(firstCharStyle.linethrough || textBox.linethrough),
      fill: firstCharStyle.fill || textBox.fill || "#000000",
      textAlign: textBox.textAlign || "left",
    };
  }, [fabCanvas]);

  // Optimized function to update text options state
  const updateTextOptionsState = useCallback(() => {
    const styles = getCurrentTextStyles();
    if (styles) {
      // Only update if styles have actually changed
      const hasChanged = Object.keys(styles).some(
        (key) => textOptions[key] !== styles[key]
      );

      if (hasChanged) {
        debouncedUpdateState(styles);
      }
    }
  }, [getCurrentTextStyles, textOptions, debouncedUpdateState]);

  // Enhanced text option application with state sync
  const applyTextOption = useCallback(
    (option, value?: any) => {
      textOptionsApply(option, value);

      // Update state immediately for UI responsiveness
      switch (option) {
        case "bold":
          setTextOptions((prev) => ({
            ...prev,
            fontWeight: prev.fontWeight === "bold" ? "normal" : "bold",
          }));
          break;
        case "italic":
          setTextOptions((prev) => ({
            ...prev,
            fontStyle: prev.fontStyle === "italic" ? "normal" : "italic",
          }));
          break;
        case "underline":
          setTextOptions((prev) => ({
            ...prev,
            underline: !prev.underline,
          }));
          break;
        case "strike":
          setTextOptions((prev) => ({
            ...prev,
            linethrough: !prev.linethrough,
          }));
          break;
        case "fontFamily":
          setTextOptions((prev) => ({
            ...prev,
            fontFamily: value,
          }));
          break;
        case "fontSize":
          setTextOptions((prev) => ({
            ...prev,
            fontSize: value,
          }));
          break;
        case "fontColor":
          setTextOptions((prev) => ({
            ...prev,
            fill: value,
          }));
          break;
      }

      // Verify state after fabric.js updates
      setTimeout(updateTextOptionsState, 10);
    },
    [textOptionsApply, updateTextOptionsState]
  );

  // Keyboard shortcuts with preventDefault
  const handleKeyDown = useCallback(
    (e) => {
      if (!openTextOptions || !e.ctrlKey) return;

      const shortcuts = {
        b: "bold",
        i: "italic",
        u: "underline",
        s: "strike",
      };

      const action = shortcuts[e.key.toLowerCase()];
      if (action) {
        e.preventDefault();
        e.stopPropagation();
        applyTextOption(action);
      }
    },
    [openTextOptions, applyTextOption]
  );

  // Optimized mouse down handler
  const handleMouseDown = useCallback(
    (e) => {
      const target = e.target;
      const isTextbox = target && target.type === "textbox";

      if (isTextbox) {
        if (!openTextOptions) {
          setOpenTextOption(true);
        }
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          updateTextOptionsState();
        });
      } else if (openTextOptions) {
        setOpenTextOption(false);
      }
    },
    [openTextOptions, setOpenTextOption, updateTextOptionsState]
  );

  // Selection change handler
  const handleSelectionChanged = useCallback(() => {
    if (openTextOptions) {
      requestAnimationFrame(updateTextOptionsState);
    }
  }, [openTextOptions, updateTextOptionsState]);

  // Text alignment toggle
  const handleTextAlignToggle = useCallback(() => {
    const newIndex = (textAlignIndex + 1) % textAlignOptions.length;
    const newAlign = textAlignOptions[newIndex];

    setTextAlignIndex(newIndex);
    setTextAlign(newAlign);

    textOptionsApply(newAlign.align);
    setTextOptions((prev) => ({ ...prev, textAlign: newAlign.align }));
  }, [textAlignIndex, textOptionsApply]);

  // Font family change handler
  const handleFontFamilyChange = useCallback(
    (value) => {
      applyTextOption("fontFamily", value);
    },
    [applyTextOption]
  );

  // font size change handler
  const handleFontSizeChange = useCallback(
    (value) => {
      const size = parseInt(value, 10);
      applyTextOption("fontSize", size);
    },
    [applyTextOption]
  );

  // Color change handler
  const handleColorChange = useCallback(
    (e) => {
      const color = e.target.value;
      applyTextOption("fontColor", color);
    },
    [applyTextOption]
  );

  // Event listeners setup
  useEffect(() => {
    if (!fabCanvas) return;

    const events = [
      ["mouse:down", handleMouseDown],
      ["selection:changed", handleSelectionChanged],
      ["text:selection:changed", handleSelectionChanged],
      ["text:changed", handleSelectionChanged],
    ];

    events.forEach(([event, handler]: any) => {
      fabCanvas.on(event, handler);
    });

    return () => {
      events.forEach(([event, handler]: any) => {
        fabCanvas.off(event, handler);
      });
    };
  }, [fabCanvas, handleMouseDown, handleSelectionChanged]);

  // Keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedUpdateState.cancel();
    };
  }, [debouncedUpdateState]);

  // Memoized button classes for performance
  const getButtonClass = useCallback(
    (isActive) =>
      `${isActive ? "bg-pink-600 text-white" : "hover:bg-pink-600"} 
     border hover:bg-pink-600 dark:text-white px-3 rounded-lg 
     transition-colors duration-150 flex items-center justify-center py-2`,
    []
  );

  if (!openTextOptions) return null;

  return (
    <div>
      <dialog
        className="z-[9] bg-transparent animate__animated animate__fadeInDown animate__faster dark:text-white p-3 w-full rounded-xl top-10"
        open={openTextOptions}
      >
        <div className="dark:bg-zinc-800 max-w-2xl mx-auto rounded-lg px-1 py-1 flex gap-2 justify-center shadow-2xl bg-white items-center border">
          {/* Font Family Selector */}
          <Select
            value={textOptions.fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Family</SelectLabel>
                {fontFamily.map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    <div
                      className="flex gap-10 justify-between w-full items-center"
                      style={{ fontFamily: font.family }}
                    >
                      {font.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={textOptions.fontSize.toString()}
            onValueChange={handleFontSizeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Size</SelectLabel>
                {fontSizes.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    <div className="w-full text-left">{size}px</div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Bold Button */}
          <button
            className={getButtonClass(textOptions.fontWeight === "bold")}
            onClick={() => applyTextOption("bold")}
            title="Bold (Ctrl+B)"
            type="button"
          >
            <ImBold />
          </button>

          {/* Italic Button */}
          <button
            className={getButtonClass(textOptions.fontStyle === "italic")}
            onClick={() => applyTextOption("italic")}
            title="Italic (Ctrl+I)"
            type="button"
          >
            <Italic size={18} />
          </button>

          {/* Underline Button */}
          <button
            className={getButtonClass(textOptions.underline)}
            onClick={() => applyTextOption("underline")}
            title="Underline (Ctrl+U)"
            type="button"
          >
            <Underline size={18}/>
          </button>

          {/* Strikethrough Button */}
          <button
            className={getButtonClass(textOptions.linethrough)}
            onClick={() => applyTextOption("strike")}
            title="Strikethrough (Ctrl+S)"
            type="button"
          >
            <Strikethrough size={18}/>
          </button>

          {/* Text Alignment Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleTextAlignToggle}
            title="Text Alignment"
            type="button"
          >
            <textAlign.Icon />
          </Button>

          {/* Color Picker */}
          <div>
            <Input
              onChange={handleColorChange}
              className="rounded-lg w-20 h-9 color-input"
              type="color"
              value={textOptions.fill}
              title="Text Color"
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TextEditOption;
