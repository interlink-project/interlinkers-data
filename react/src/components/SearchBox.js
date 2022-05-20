import { Box, Card, Input, LinearProgress } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useCustomTranslation } from "hooks/useDependantTranslation";

const SearchBox = ({ language, loading, inputValue, setInputValue, size = "large" }) => {
    const t = useCustomTranslation(language)

    return <Card sx={{ my: 2, mx: 10 }}>
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                py: size === "small" ? 1 : 2,
                px: 2
            }}
        >
            <Search fontSize='small' />
            <Box
                sx={{
                    flexGrow: 1,
                    ml: 3
                }}
            >
                <Input
                    disabled={loading}
                    disableUnderline
                    size={size}
                    fullWidth
                    onChange={(event) => {
                        setInputValue(event.target.value);
                    }}
                    placeholder={t('Search')}
                    value={inputValue}
                />
            </Box>
        </Box>
        {loading && <LinearProgress />}
    </Card>
}

export default SearchBox