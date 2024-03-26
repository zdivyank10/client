import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';

function Famous() {
  const { API_BASE_URL } = useAuth();
  const [popularblog, setPopularblog] = useState([]);

  const popular_blogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/like/popular`, {
        method: "GET",
      });
      const data = await response.json();
      setPopularblog(data);
      console.log('Popular blog data:', data);
    } catch (error) {
      console.error('Error fetching popular blogs:', error);
    }
  };

  useEffect(() => {
    popular_blogs();
  }, []);

  return (
    <Row xs={1} md={2} lg={5} className="g-4 m-3" style={{ display: 'flex'}} >
      {popularblog && popularblog.map((post, index) => {
        const { _id, title, cover_img, content, createdAt,author_id } = post;
        const sanitizedContent = DOMPurify.sanitize(content);
        return (
          <Col key={_id}>
            <Card style={{ height: '100%' }}>
              <Card.Img variant="top" src={`${API_BASE_URL}uploads/${cover_img}`} />
              <Card.Body>
                <Card.Title>{author_id.username}</Card.Title>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                  <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">{createdAt}</small>
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  );
}

export default Famous;
