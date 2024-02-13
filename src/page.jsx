import { Button, Card, Col, Container, Row } from "react-bootstrap";
import sign from "jwt-encode";
import { useState } from "react";
import Input from "./input";
import { get, set } from "./utils";
import { toast } from "react-toastify";

export default function Page() {

  const token = useState();
  const json = useState();

  const issuer = useState('');
  const audience = useState('');
  const subject = useState('');
  const secret = useState('');

  const dateIn = useState(dateToStr(new Date()));
  const dateOut = useState(dateToStr(new Date(Date.now() + 60 * 60 * 1000)));

  const [claims, setClaims] = useState([]);

  return (
    <Container>
      <h1>Token Generator</h1>

      <Row>
        <Col>
          <Input label="Issuer" compValue={issuer} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Input label="Audience" compValue={audience} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Input label="Subject" compValue={subject} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Input label="Issued data/time" compValue={dateIn} datetime />
        </Col>
        <Col>
          <Input label="Expiration date/time" compValue={dateOut} datetime />
        </Col>
      </Row>

      <br />

      <Card>
        <Card.Header><b>Custom Claims</b></Card.Header>
        <Card.Body>
          <Button variant="warning" onClick={addClaim}>Add Claim</Button>

          {claims.map((x, index) =>
            <Row key={'claim_' + x.id}>
              <Col>
                <span>Name</span>
                <input type="text" className="form-control" value={x.name} onChange={ev => setClaimProp(index, 'name', ev)} />
              </Col>
              <Col>
                <span>Value</span>
                <input type="text" className="form-control" value={x.value} onChange={ev => setClaimProp(index, 'value', ev)} />
              </Col>
              <Col>
                <br />
                <Button variant="danger" onClick={() => deleteClaim(x)}>Delete</Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <br />

      <Row>
        <Col>
          <Input label="Secret" compValue={secret} />
        </Col>
      </Row>

      <br />
      <Button onClick={encode}>Encode</Button>
      <br />
      <br />

      <span>Token</span>
      <textarea className="form-control" value={get(token)} readOnly rows={5} />

      <span>JSON</span>
      <textarea className="form-control" style={{ fontFamily: 'monospace' }} value={get(json)} readOnly rows={10} />

    </Container>
  )

  function dateToStr(d) {
    return d.toISOString().slice(0, 16);
  }

  function strToDateForToken(s) {
    return Math.floor(new Date(s) / 1000);
  }

  function setClaimProp(index, propName, ev) {
    const lst = [...claims];
    lst[index][propName] = ev.target.value;
    setClaims(lst);
  }

  function addClaim() {
    setClaims([
      ...claims, {
        id: crypto.randomUUID(),
        name: '',
        value: ''
      }
    ]);
  }

  function deleteClaim(claim) {
    setClaims(claims.filter(x => x.id !== claim.id));
  }

  function encode() {
    const key = get(secret).trim();
    if (!key) {
      toast.error('Please inform secret key');
      return;
    }

    const data = {};

    function add(c, propName) {
      const v = get(c).trim();
      if (v) data[propName] = v;
    }

    add(issuer, 'iss');
    add(audience, 'aud');
    add(subject, 'sub');

    if (get(dateIn)) data['iat'] = strToDateForToken(get(dateIn));
    if (get(dateOut)) data['exp'] = strToDateForToken(get(dateOut));

    claims.forEach(x => {
      const name = x.name.trim();
      if (name) {
        data[name] = x.value;
      }
    })

    const jwt = sign(data, get(secret));
    set(json, JSON.stringify(data, null, 2));
    set(token, jwt);
  }

}