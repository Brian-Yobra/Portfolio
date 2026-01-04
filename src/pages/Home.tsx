import "../css/Home.css";
// import image from "../assets/background.jpg";
import Portfolio from "../json/Exp.json";

interface profileProp {
  name: string;
  title: string;
  institution: string;
  image: string;
  Description: string;
}

interface expItem {
  place: string;
  role: string;
  description: string;
  timeline: string | number;
}
interface ExperienceProps {
  id: number;
  Category: string;
  items: expItem[];
}

export function Personal({ data }: { data: profileProp }) {
  return (
    <div className="introduction">
      <img className="profilePic" src={data.image}></img>

      <h1>{data.name}</h1>
      <p>
        <div>{data.title}</div>
        <div>{data.institution}</div>
        <div>{data.Description}</div>
      </p>
    </div>
  );
}

export function Experience({ data }: { data: ExperienceProps }) {
  return (
    <>
      <div className="experience">
        {data.items.map((item) => (
          <>
            <h1>{data.Category}</h1>
            <h3>{item.place}</h3>
            <div>{item.role}</div>
            <div>{item.description}</div>
            <div>{item.timeline}</div>
          </>
        ))}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="home">
      {Portfolio.profile.map((current) => (
        <Personal data={current} />
      ))}

      {Portfolio.sections.map((section) => (
        <Experience data={section} key={section.id} />
      ))}
    </div>
  );
}
