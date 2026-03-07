use std::fmt::{Debug, Display};
use tokio::task::JoinError;

use portfoliostr::configuration::get_configuration;
use portfoliostr::issue_delivery_worker::run_worker_until_stopped;
use portfoliostr::startup::Application;
use portfoliostr::telemetry::{get_subscriber, init_subscriber};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let subscriber = get_subscriber("portfoliostr".into(), "info".into(), std::io::stdout);
    init_subscriber(subscriber);

    // Panic if we can't read configuration
    let configuration = get_configuration().expect("Failed to read configuration.");
    let application = Application::build(configuration.clone()).await?;
    let application_task = tokio::spawn(application.run_until_stopped(configuration.clone()));
    let worker_task = tokio::spawn(run_worker_until_stopped(configuration));

    tokio::select! {
        app_outcome = application_task => report_exit("API", app_outcome),
        worker_outcome = worker_task => report_exit("Background worker", worker_outcome),
    };

    Ok(())
}

fn report_exit(task_name: &str, outcome: Result<Result<(), impl Debug + Display>, JoinError>) {
    match outcome {
        Ok(Ok(())) => {
            tracing::info!("{} has exited", task_name)
        }
        Ok(Err(e)) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{} failed",
                task_name
            )
        }
        Err(e) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{}' task failed to complete",
                task_name
            )
        }
    }
}
