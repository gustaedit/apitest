import React, { useState, useEffect } from "react";
// tentativas
interface Olimpiada {
  id: number;
  name: string;
  img?: string;
}

const ListaOlimpiadas: React.FC = () => {
  const [olimpiadas, setOlimpiadas] = useState<Olimpiada[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://app.olimpiadas.app/teste")
      .then((res) => res.json())
      .then((resultado) => setOlimpiadas(resultado.data))
      .catch((error) => console.error("Erro ao buscar dados:", error));
  }, []); 

  const extractVideoId = (url: string | undefined): string | undefined =>
    url && (url.match(/i3\.ytimg\.com\/vi\/\s*([a-zA-Z0-9_-]+)\s*\/maxresdefault\.jpg/)?.[1] ||
            url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]);

  const generateThumbnailUrl = (videoId: string | undefined): string | undefined =>
    videoId && `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  const handleThumbnailClick = (videoId: string) => setPlayingVideoId(videoId);
  const handleVideoEnd = () => setPlayingVideoId(null);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Lista de Olimpíadas</h1>
      {olimpiadas.length === 0 && <p style={{ textAlign: "center" }}>Carregando...</p>}
      {olimpiadas.map((olimpiada) => (
        <div key={olimpiada.id} style={{ margin: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2>{olimpiada.name}</h2>
          {olimpiada.img && !playingVideoId && (
            <img
              src={generateThumbnailUrl(extractVideoId(olimpiada.img))}
              alt={olimpiada.name}
              style={{ width: "100%", height: "auto", display: "block", margin: "0 auto", cursor: "pointer" }}
              onClick={() => handleThumbnailClick(extractVideoId(olimpiada.img) || "")}
            />
          )}
          {playingVideoId === extractVideoId(olimpiada.img) && (
            <iframe
              src={olimpiada.img}
              title={olimpiada.name}
              width="100%"
              height="300"
              style={{ display: "block", margin: "0 auto" }}
              allowFullScreen
              onEnded={handleVideoEnd}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaOlimpiadas;

