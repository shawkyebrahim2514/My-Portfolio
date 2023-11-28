import { useEffect, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import SectionTitle from '../../components/SectionTitle';
import Icon from '../../components/Icon';
import { getContacts } from '../../APIs';

function Contacts() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        // getContacts().then((res) => {

        // })

        let result = [
            {
                "name": "WUZZUF",
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/ac5c98a28f6b434920b7407a99e135391c136e11-200x32.svg",
                "link": "https://wuzzuf.net/me/shawkyebrahim2514"
            },
            {
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/f51bb37cd899cf2a91efc6286dcb366b319d2962-512x512.png",
                "link": "https://github.com/shawkyebrahim2514",
                "name": "GitHub"
            },
            {
                "name": "Facebook",
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/f3ec45e63fff1ba1a6e0f721c0a8b269cca5c099-512x512.png",
                "link": "https://www.facebook.com/shawky.ebrahim.ahmed/"
            },
            {
                "name": "Gmail",
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/f8280a570fad96de235b7580e4385a12e40e8df5-43x32.svg",
                "link": "mailto:shawkyebrahim2514@gmail.com"
            },
            {
                "name": "LinkedIn",
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/8444c2665efe5d026dcbcb1321b6c7530ace0e5f-32x32.svg",
                "link": "https://www.linkedin.com/in/shawkyebrahim2514/"
            },
            {
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/a4e3a6131ec297b9faa54a4ffdfb3ae53cb69d3a-32x32.svg",
                "link": "https://t.me/shawkyebrahim2514",
                "name": "Telegram"
            }
        ];

        let newState = []

        result.forEach((element) => {
            newState.push({
                link: element.link,
                alt: element.name,
                imgSrc: element.imgSrc,
            })
        })

        setContacts(newState);
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            gap: "2rem",
        }}>
            <SectionTitle
                highlightedText={"Contacts"}
                text={"You can reach me through"} />

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap",
            }}>
                {contacts.map((project, index) => {
                    return (
                        <Icon
                            key={project.alt}
                            src={project.imgSrc}
                            alt={project.alt}
                            text={project.alt}
                            pointer={true}
                            onClick={() => window.open(project.link, "_blank")}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default ContainerWrap(Contacts)
