// const [planets, setPlanets] = useState(null);
// const [position, setPosition] = useState(null);

// async function fetchPosition() {
//     const res = await fetch('http://localhost:8000/planets/${planet}');
//     setPosition(await res.json());
// }

export async function getPlanets() {
    const res = await fetch('http://localhost:8000/planets/');
    return res.json();
}

