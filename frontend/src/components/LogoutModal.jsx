import { Modal, Button } from "react-bootstrap";

export default function LogoutModal({ show, onClose, onConfirm }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="logout-modal"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="fw-semibold text-light">
          Sei sicuro di voler uscire?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {/* GIF Truman Show */}
        <img
          src="/images/truman-exit.gif"
          alt="Truman sale la scaletta"
          className="logout-gif mb-3"
        />

        <p className="mb-3 logout-quote text-light fst-italic">
          “Caso mai non vi rivedessi, buon pomeriggio, buonasera e buonanotte!”
        </p>
      </Modal.Body>

      <Modal.Footer className="justify-content-center gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          className="btn-nav-glow"
        >
          Resta nel mondo
        </Button>
        <Button
          className="btn-nav-glow btn-nav-logout"
          onClick={onConfirm}
        >
          Esci da FILMOON
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
