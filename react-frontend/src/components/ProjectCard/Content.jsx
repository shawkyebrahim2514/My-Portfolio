import { useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text';
import ListButtons from '../ListButtons';
import ListItems from '../ListItems';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function Content({ title, description, technologies }) {
    const theme = useContext(Context);
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "0.25rem",
            }}>
                <Text
                    variant={"h3"}
                    style={{
                        color: theme.colors.main.full,
                    }}
                >{title}</Text>
                <ListItems
                    elements={description.split("\n")}
                    icon={<FontAwesomeIcon icon={faAngleRight} />} />
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}
