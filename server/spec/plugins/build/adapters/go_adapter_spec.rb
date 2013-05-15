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
            pipeline_run1.stub(:stages).and_return([stage1, stage2, stage3])
            pipeline_run2.stub(:stages).and_return([stage1, stage2])

            last_run = double("LastRun")
            last_run.stub(:pipelines).and_return(@pipelines)
            GoApiClient.should_receive(:runs).
              with(:host => 'test.host', :port => 1234, :pipeline_name => 'test-pipeline').
              and_return(last_run)
            GoApiClient.stub(:build_in_progress?)
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

            runtime_info.last_build_time.should == "2012-06-24 19:14:43 +1000"
            runtime_info.duration.should == 765
            runtime_info.success.should == true
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

            runtime_info.last_build_time.should == "2012-05-13 20:49:25 +1000"
            runtime_info.duration.should == 57
            runtime_info.success.should == true
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

            runtime_info.last_build_time.should == "2012-05-31 17:24:15 +1000"
            runtime_info.duration.should == 123
            runtime_info.success.should == true
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

            runtime_info.last_build_time.should == "2012-05-31 17:24:14 +1000"
            runtime_info.duration.should == 32
            runtime_info.success.should == false
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

            runtime_info.last_build_time.should == "2012-05-13 20:49:26 +1000"
            runtime_info.duration.should == 89
            runtime_info.success.should == false
          end
          it("should return current build status as 0 when pipeline is not building") do
            GoApiClient.should_receive(:build_in_progress?).
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

            runtime_info.status.should == 0
          end
          it("should return current build status as 1 when pipeline is building") do
            GoApiClient.should_receive(:build_in_progress?).
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

            runtime_info.status.should == 1
          end
        end
      def given_a_stage(name, passed = true, time = nil, jobs = [])
        stage = double("stage[#{name}]")
        stage.stub(:name => name)
        stage.stub(:passed? => passed)
        stage.stub(:failed? => !passed)
        stage.stub(:completed_at => time)
        stage.stub(:jobs => jobs)
        stage
      end
      def given_a_job(name, result, duration, time)
        job = double("job[#{name}")
        job.stub(:name => name)
        job.stub(:result => result)
        job.stub(:duration => duration)
        job.stub(:completed => time)
        job
      end
      end
    end
  end
end