
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagsInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value?: string[]
  onChange?: (tags: string[]) => void
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  ({ className, value = [], onChange, placeholder = "Type and press comma to add tags...", disabled, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      
      if (newValue.includes(",")) {
        const newTags = newValue
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0 && !value.includes(tag))
        
        if (newTags.length > 0 && onChange) {
          onChange([...value, ...newTags])
        }
        setInputValue("")
      } else {
        setInputValue(newValue)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault()
        const trimmedValue = inputValue.trim()
        if (!value.includes(trimmedValue) && onChange) {
          onChange([...value, trimmedValue])
        }
        setInputValue("")
      } else if (e.key === "Backspace" && !inputValue && value.length > 0 && onChange) {
        onChange(value.slice(0, -1))
      }
    }

    const removeTag = (indexToRemove: number) => {
      if (onChange) {
        onChange(value.filter((_, index) => index !== indexToRemove))
      }
    }

    const focusInput = () => {
      inputRef.current?.focus()
    }

    return (
      <div
        data-slot="tags-input"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          !disabled && "cursor-text",
          "md:text-sm",
          className
        )}
        onClick={focusInput}
      >
        <div className="flex flex-wrap gap-1 items-center w-full">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(index)
                  }}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-0 bg-transparent border-none outline-none placeholder:text-muted-foreground"
            {...props}
          />
        </div>
      </div>
    )
  }
)
