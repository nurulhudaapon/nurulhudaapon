package com.nurulhudaapon.idetect;

import io.grpc.Channel;
import io.grpc.Grpc;
import io.grpc.InsecureChannelCredentials;
import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;

import java.awt.FlowLayout;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class IdetectClient {
  private static final Logger logger = Logger.getLogger(IdetectClient.class.getName());

  private final ScannerGrpc.ScannerBlockingStub blockingStub;

  /** Construct client for accessing Idetect server using the existing channel. */
  public IdetectClient(Channel channel) {
    blockingStub = ScannerGrpc.newBlockingStub(channel);
  }

  /** Say hello to server. */
  public String scan(String message) {
    ResultRequest request = ResultRequest.newBuilder().setMessage(message).build();
    ResultReply response;

    try {
      response = blockingStub.result(request);
    } catch (StatusRuntimeException e) {
      logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
      return "Error";
    }

    logger.info("Client -> Response: " + response.getMessage());

    return response.getMessage();

  }

  /**
   * Application Entry Point
   * 
   * @param args
   * @throws Exception
   */
  public static void main(String[] args) throws Exception {

    JFrame f = new JFrame();// creating instance of JFrame
    f.setTitle("IDetect");

    JButton b = new JButton("click");// creating instance of JButton
    b.setBounds(130, 100, 100, 40);// x axis, y axis, width, height
    f.add(b);// adding button in JFram
    f.setSize(400, 500);// 400 width and 500 height
    f.setLayout(null);// using no layout managers
    f.setVisible(true);// making the frame visible

    // Swing Textbox
    ImageIcon icon = new ImageIcon("test.jpeg");
    f.add(new JLabel(icon));
    f.pack();

    File file = new File("/Users/nurulhudaapon/Projects/nurulhudaapon/idetect/test.jpeg");

    BufferedImage bufferedImage = ImageIO.read(file);

    // convert image to base64 encoded string using built-in java library
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    ImageIO.write(bufferedImage, "jpeg", byteArrayOutputStream);
    byte[] imageBytes = byteArrayOutputStream.toByteArray();

    // String base64String =
    // javax.xml.bind.DatatypeConverter.printBase64Binary(imageBytes);

    // System.out.println(base64String);
    // logger.info("Client -> Request: " + base64String);

    ImageIcon imageIcon = new ImageIcon(bufferedImage);
    JFrame jFrame = new JFrame();

    jFrame.setLayout(new FlowLayout());

    jFrame.setSize(500, 500);
    JLabel jLabel = new JLabel();

    jLabel.setIcon(imageIcon);
    jFrame.add(jLabel);
    jFrame.setVisible(true);

    jFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

    // Java Swing Image Container

    String target = "localhost:5051";
    ManagedChannel channel = Grpc.newChannelBuilder(target,
        InsecureChannelCredentials.create()).build();

    try {

      IdetectClient client = new IdetectClient(channel);

      while (true) {
        String res = client.scan("Client -> Request Message");

        b.setText(res);
        jLabel.setText(res);

      }

    } finally {

      channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);

    }
  }
}
