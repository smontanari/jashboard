require 'open-uri'
require 'nokogiri'
require 'go_api_client'
require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module Build
      module GoAdapter
        def get_go_runtime_info(configuration)
          adapter = GoAdapter.new(configuration)
          status = adapter.get_current_status
          if (configuration.job)
            job = adapter.get_last_job
            runtime_info = BuildRuntimeInfo.new(job.completed.localtime.to_s, job.duration, job.result == "Passed", status)
          else
            stage = adapter.get_last_stage
            runtime_info = BuildRuntimeInfo.new(stage.completed_at.localtime.to_s, stage.duration, stage.passed?, status)
          end
          runtime_info
        end

        class GoAdapter
          def initialize(configuration)
            @options = {:host => configuration.hostname, :port => configuration.port, :pipeline_name => configuration.pipeline}
            @stage_name = configuration.stage
            @job_name = configuration.job
          end

          def get_last_stage
            GoApiClient.runs(@options).pipelines.last.stages.find {|s| s.name == @stage_name} .tap do |stage|
              def stage.duration
                self.jobs.reduce(0) {|d, job| d + job.duration}
              end
            end
          end
          def get_last_job
            get_last_stage.jobs.find {|j| j.name == @job_name}
          end

          def get_current_status
            build_in_progress = GoApiClient.build_in_progress?(@options)
            return build_in_progress ? 1 : 0
          end
        end
      end
    end
  end
end
