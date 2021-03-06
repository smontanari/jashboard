require 'spec_helper'
require 'go_api_client'
require 'plugins/build/adapters/go_adapter'

module Jashboard
  module Plugin
    module Build
      describe GoAdapter do
        include Jashboard::RSpecHelper
        before(:each) do
          adapter_class = Class.new do
            include GoAdapter
          end
          @adapter = adapter_class.new
        end

        context("Build runtime info retrieval") do
          before(:each) do
            pipeline_run1 = double("pipeline_run1")
            pipeline_run2 = double("pipeline_run2")
            @pipelines = [
              pipeline_run1,
              pipeline_run2
            ]
            stage1 = given_a_stage("test-stage1", true, Time.utc(2012, 5, 31, 7, 24, 15), [
              given_a_job("test-job2", "Passed", 123, Time.utc(2012, 5, 31, 7, 24, 14))
            ])
            stage2 = given_a_stage("test-stage2", false, Time.utc(2012, 5, 13, 10, 49, 26), [
              given_a_job("test-job1", "Failed", 32, Time.utc(2012, 5, 31, 7, 24, 14)),
              given_a_job("test-job2", "Passed", 57, Time.utc(2012, 5, 13, 10, 49, 25))
            ])
            stage3 = given_a_stage("test-stage3", true, Time.utc(2012, 5, 31, 7, 24, 15), [
              given_a_job("test-job3", "Passed", 765, Time.utc(2012, 6, 24, 9, 14, 43))
            ])
            allow(pipeline_run1).to receive(:stages).and_return([stage1, stage2, stage3])
            allow(pipeline_run2).to receive(:stages).and_return([stage1, stage2])

            last_run = double("LastRun")
            allow(last_run).to receive(:pipelines).and_return(@pipelines)
            expect(GoApiClient).to receive(:runs).
              with(:host => 'test.host', :port => 1234, :pipeline_name => 'test-pipeline').
              and_return(last_run)
            allow(GoApiClient).to receive(:build_in_progress?)
          end

          it("should always retrieve the last completed stage") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage3",
              job: "test-job3"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.last_build_time).to eq("2012-06-24 19:14:43 +1000")
            expect(runtime_info.duration).to eq(765)
            expect(runtime_info.success).to eq(true)
          end

          it("should return last build information for a successful job") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job2"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.last_build_time).to eq("2012-05-13 20:49:25 +1000")
            expect(runtime_info.duration).to eq(57)
            expect(runtime_info.success).to eq(true)
          end
          it("should return last build information for a successful stage") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage1",
              job: nil
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.last_build_time).to eq("2012-05-31 17:24:15 +1000")
            expect(runtime_info.duration).to eq(123)
            expect(runtime_info.success).to eq(true)
          end
          it("should return last build information for a failed job") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job1"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.last_build_time).to eq("2012-05-31 17:24:14 +1000")
            expect(runtime_info.duration).to eq(32)
            expect(runtime_info.success).to eq(false)
          end
          it("should return last build information for a failed stage") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: nil
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.last_build_time).to eq("2012-05-13 20:49:26 +1000")
            expect(runtime_info.duration).to eq(89)
            expect(runtime_info.success).to eq(false)
          end
          it("should return current build status as 0 when pipeline is not building") do
            expect(GoApiClient).to receive(:build_in_progress?).
              with(:host => 'test.host', :port => 1234, :pipeline_name => 'test-pipeline').
              and_return(false)
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job1"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.status).to eq(0)
          end
          it("should return current build status as 1 when pipeline is building") do
            expect(GoApiClient).to receive(:build_in_progress?).
              with(:host => 'test.host', :port => 1234, :pipeline_name => 'test-pipeline').
              and_return(true)
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job1"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            expect(runtime_info.status).to eq(1)
          end
        end
      def given_a_stage(name, passed = true, time = nil, jobs = [])
        stage = double("stage[#{name}]")
        allow(stage).to receive_messages(:name => name)
        allow(stage).to receive_messages(:passed? => passed)
        allow(stage).to receive_messages(:failed? => !passed)
        allow(stage).to receive_messages(:completed_at => time)
        allow(stage).to receive_messages(:jobs => jobs)
        stage
      end
      def given_a_job(name, result, duration, time)
        job = double("job[#{name}")
        allow(job).to receive_messages(:name => name)
        allow(job).to receive_messages(:result => result)
        allow(job).to receive_messages(:duration => duration)
        allow(job).to receive_messages(:completed => time)
        job
      end
      end
    end
  end
end