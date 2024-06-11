import { Close } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function SearchInput({
  label,
  loading,
  onSubmit,
  value,
}: {
  label: string;
  loading: boolean;
  onSubmit: (value: string) => void;
  value: string | undefined;
}) {
  // react-state
  const [input, setInput] = useState<string>("");

  // search handler
  const searchHandler = (e: any) => {
    e.preventDefault();
    onSubmit(input);
  };

  useEffect(() => {
    if (value) {
      setInput(value);
    }
  }, [value]);

  return (
    <form className="sm:max-w-[400px]" onSubmit={searchHandler}>
      <div className="flex">
        <div className="flex-1">
          <TextField
            fullWidth
            label={label}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
              endAdornment: input && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setInput("");
                      onSubmit("");
                    }}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          disabled={Boolean(!input) || loading}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
