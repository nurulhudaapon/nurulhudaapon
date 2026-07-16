package com.nurulhudaapon.idetect;

import io.grpc.Grpc;
import io.grpc.InsecureServerCredentials;
import io.grpc.Server;
import io.grpc.stub.StreamObserver;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;
import java.io.File;

public class IdetectServer {

  private static final Logger logger = Logger.getLogger(IdetectServer.class.getName());
  private Server server;

  private void start() throws IOException {
    /* The port on which the server should run */
    int port = 5051;

    server = Grpc.newServerBuilderForPort(port, InsecureServerCredentials.create())
        .addService(new ScannerImpl())
        .build()
        .start();

    logger.info("Server started, listening on " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {

      @Override
      public void run() {

        // Use stderr here since the logger may have been reset by its JVM shutdown
        // hook.
        System.err.println("*** shutting down gRPC server since JVM is shutting down");

        try {

          IdetectServer.this.stop();

        } catch (InterruptedException e) {

          e.printStackTrace(System.err);

        }

        System.err.println("*** server shut down");
      }
    });
  }

  private void stop() throws InterruptedException {
    if (server != null) {
      server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
    }
  }

  /**
   * Await termination on the main thread since the grpc library uses daemon
   * threads.
   */
  private void blockUntilShutdown() throws InterruptedException {
    if (server != null) {
      server.awaitTermination();
    }
  }

  static String processedText = "Default";

  /**
   * Main launches the server from the command line.
   */
  public static void main(String[] args) throws IOException, InterruptedException {
    final IdetectServer server = new IdetectServer();
    server.start();
    server.blockUntilShutdown();
  }

  public static String processText(String text) {

    try {
      processedText = text;
      return text;

    } catch (Exception e) {

      System.err.println(e);

    }

    return "Error";
  }

  static class ScannerImpl extends ScannerGrpc.ScannerImplBase {
    @Override
    public void scan(ScannedRequest req, StreamObserver<ScannedReply> responseObserver) {

      String processedText = processText(req.getText());
      ScannedReply reply = ScannedReply.newBuilder().setMessage(processedText).build();

      System.out.println("Received request: " + req.getText() + ", Scan Result: " + processedText);

      responseObserver.onNext(reply);
      responseObserver.onCompleted();
    }

    @Override
    public void result(ResultRequest req, StreamObserver<ResultReply> responseObserver) {

      // String processedText = processText(req.getMessage());
      ResultReply reply = ResultReply.newBuilder().setMessage(IdetectServer.processedText).build();

      System.out.println("Received request: " + req.getMessage() + ", Scan Result: " + processedText);

      responseObserver.onNext(reply);
      responseObserver.onCompleted();
    }
  }
}
